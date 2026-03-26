"""
SM-2 间隔重复算法实现
"""
from datetime import datetime, timedelta
from typing import Dict, List, Optional
import math

class SM2ReviewSystem:
    """
    SM-2 (SuperMemo 2) 间隔重复算法

    核心公式:
    - EF' = EF + (0.1 - (5-q) * (0.08 + (5-q) * 0.02))
    - I(n) = I(n-1) * EF

    其中:
    - EF: 难度因子 (Easiness Factor)
    - q: 质量评分 (0-5)
    - I(n): 第 n 次复习的间隔
    """

    def __init__(self):
        # 内存存储，生产环境应使用数据库
        # 结构: { item_id: { ease_factor, interval, next_review, review_count, last_review } }
        self._reviews: Dict[int, Dict] = {}
        # 本地存储路径
        self._storage_key = "sm2_reviews"

    def _load_from_storage(self):
        """从 localStorage 加载数据（由前端处理）"""
        pass

    def _save_to_storage(self):
        """保存到 storage"""
        pass

    def get_due_items(self) -> List[Dict]:
        """获取所有到期复习的项目"""
        now = datetime.utcnow()
        due = []

        for item_id, data in self._reviews.items():
            if data["next_review"] <= now:
                due.append({
                    "item_id": item_id,
                    "ease_factor": data["ease_factor"],
                    "interval": data["interval"],
                    "next_review": data["next_review"],
                })

        return sorted(due, key=lambda x: x["next_review"])

    def get_item(self, item_id: int) -> Optional[Dict]:
        """获取项目的复习数据"""
        return self._reviews.get(item_id)

    def review(self, item_id: int, quality: int) -> Dict:
        """
        处理复习

        Args:
            item_id: 项目 ID
            quality: 评分 (0-5)

        Returns:
            包含新的 ease_factor, interval, next_review
        """
        # 限制质量评分范围
        quality = max(0, min(5, quality))

        now = datetime.utcnow()

        if item_id not in self._reviews:
            # 首次复习
            data = {
                "ease_factor": 2.5,
                "interval": 0,
                "next_review": now,
                "review_count": 0,
                "last_review": now,
            }
        else:
            data = self._reviews[item_id].copy()

        # SM-2 算法
        if quality < 3:
            # 忘记 - 重置间隔
            data["interval"] = 1
            data["next_review"] = now + timedelta(days=1)
        else:
            # 计算新的难度因子
            ef_change = 0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)
            data["ease_factor"] = max(1.3, data["ease_factor"] + ef_change)

            # 计算新的间隔
            if data["review_count"] == 0:
                data["interval"] = 1
            elif data["review_count"] == 1:
                data["interval"] = 6
            else:
                data["interval"] = math.ceil(data["interval"] * data["ease_factor"])

            data["next_review"] = now + timedelta(days=data["interval"])

        data["review_count"] += 1
        data["last_review"] = now

        self._reviews[item_id] = data
        return {
            "ease_factor": data["ease_factor"],
            "interval": data["interval"],
            "next_review": data["next_review"],
        }

    def reset(self, item_id: int):
        """重置复习进度"""
        if item_id in self._reviews:
            del self._reviews[item_id]

    def get_stats(self) -> Dict:
        """获取复习统计"""
        now = datetime.utcnow()
        due = self.get_due_items()

        total_reviews = sum(data["review_count"] for data in self._reviews.values())
        total_items = len(self._reviews)

        return {
            "total_items": total_items,
            "due_count": len(due),
            "total_reviews": total_reviews,
            "average_ease": (
                sum(data["ease_factor"] for data in self._reviews.values()) / total_items
                if total_items > 0 else 2.5
            ),
        }

    def import_data(self, data: List[Dict]):
        """导入复习数据（用于同步）"""
        for item in data:
            self._reviews[item["item_id"]] = {
                "ease_factor": item.get("ease_factor", 2.5),
                "interval": item.get("interval", 0),
                "next_review": datetime.fromisoformat(item["next_review"]) if isinstance(item.get("next_review"), str) else item.get("next_review", datetime.utcnow()),
                "review_count": item.get("review_count", 0),
                "last_review": datetime.fromisoformat(item["last_review"]) if isinstance(item.get("last_review"), str) else item.get("last_review"),
            }

    def export_data(self) -> List[Dict]:
        """导出复习数据"""
        return [
            {
                "item_id": item_id,
                "ease_factor": data["ease_factor"],
                "interval": data["interval"],
                "next_review": data["next_review"].isoformat(),
                "review_count": data["review_count"],
                "last_review": data["last_review"].isoformat() if data["last_review"] else None,
            }
            for item_id, data in self._reviews.items()
        ]
