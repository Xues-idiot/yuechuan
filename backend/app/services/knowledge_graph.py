import chromadb
from sentence_transformers import SentenceTransformer
from typing import Optional, List, Dict, Any
import os


class KnowledgeGraphService:
    """知识图谱服务 - 基于 ChromaDB"""

    def __init__(self, persist_directory: str = "./data/knowledge"):
        self.persist_directory = persist_directory
        os.makedirs(persist_directory, exist_ok=True)

        self.client = chromadb.PersistentClient(path=persist_directory)
        self.model = SentenceTransformer("paraphrase-multilingual-MiniLM-L12-v2")

        # 收藏的 FeedItems 集合
        self.collection = self.client.get_or_create_collection(
            name="feed_items",
            metadata={"description": "阅川内容知识库"}
        )

    def add_item(
        self,
        item_id: int,
        feed_id: int,
        title: str,
        content: str,
        feed_name: str = "",
        tags: Optional[List[str]] = None
    ):
        """
        添加内容到知识库

        Args:
            item_id: 内容ID
            feed_id: 订阅源ID
            title: 标题
            content: 内容正文
            feed_name: 订阅源名称
            tags: 标签列表
        """
        # 生成文本摘要用于向量检索
        text_to_embed = f"{title}\n{content[:500]}"

        embedding = self.model.encode(text_to_embed).tolist()

        metadata = {
            "item_id": item_id,
            "feed_id": feed_id,
            "title": title,
            "feed_name": feed_name,
            "tags": ",".join(tags or [])
        }

        self.collection.add(
            ids=[str(item_id)],
            embeddings=[embedding],
            documents=[text_to_embed],
            metadatas=[metadata]
        )

    def search_similar(
        self,
        query: str,
        limit: int = 5,
        exclude_id: Optional[int] = None
    ) -> List[Dict[str, Any]]:
        """
        搜索相似内容

        Args:
            query: 搜索文本
            limit: 返回数量
            exclude_id: 排除的内容ID

        Returns:
            相似内容列表
        """
        query_embedding = self.model.encode(query).tolist()

        results = self.collection.query(
            query_embeddings=[query_embedding],
            n_results=limit + 1  # 多查一条，因为可能包含排除项
        )

        similar = []
        for i, (doc, metadata, distance) in enumerate(zip(
            results["documents"][0],
            results["metadatas"][0],
            results["distances"][0]
        )):
            item_id = int(metadata["item_id"])
            if exclude_id and item_id == exclude_id:
                continue

            similar.append({
                "item_id": item_id,
                "feed_id": int(metadata.get("feed_id", 0)),
                "title": metadata["title"],
                "feed_name": metadata["feed_name"],
                "tags": metadata["tags"].split(",") if metadata["tags"] else [],
                "score": 1 - distance  # 转换距离为相似度
            })

            if len(similar) >= limit:
                break

        return similar

    def delete_item(self, item_id: int):
        """从知识库删除内容"""
        self.collection.delete(ids=[str(item_id)])

    def get_item_tags(self, item_id: int) -> List[str]:
        """获取内容的标签"""
        try:
            result = self.collection.get(ids=[str(item_id)])
            if result["metadatas"] and result["metadatas"][0]["tags"]:
                tags_str = result["metadatas"][0]["tags"]
                return [t.strip() for t in tags_str.split(",") if t.strip()]
        except Exception:
            pass
        return []
