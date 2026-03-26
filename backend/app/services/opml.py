from typing import List, Dict, Any
from xml.etree.ElementTree import Element, SubElement, tostring
from xml.dom import minidom


def feeds_to_opml(feeds: List[Dict[str, Any]], title: str = "阅川订阅源") -> str:
    """将订阅源列表转换为 OPML 格式"""
    root = Element("opml")
    root.set("version", "2.0")

    head = SubElement(root, "head")
    title_elem = SubElement(head, "title")
    title_elem.text = title

    body = SubElement(root, "body")

    for feed in feeds:
        outline = SubElement(body, "outline")
        outline.set("type", "rss")
        outline.set("text", feed.get("name", ""))
        outline.set("title", feed.get("name", ""))
        outline.set("xmlUrl", feed.get("url", ""))
        if feed.get("description"):
            outline.set("description", feed["description"])

    # 格式化输出
    xml_str = tostring(root, encoding="unicode")
    dom = minidom.parseString(xml_str)
    return dom.toprettyxml(indent="  ", encoding=None)


def parse_opml(opml_content: str) -> List[Dict[str, Any]]:
    """解析 OPML 内容，提取 RSS 订阅源"""
    import xml.etree.ElementTree as ET

    feeds = []
    root = ET.fromstring(opml_content)

    # 查找所有 outline 元素
    for outline in root.iter("outline"):
        xml_url = outline.get("xmlUrl") or outline.get("xmlurl")
        if xml_url:
            feed = {
                "name": outline.get("title", "") or outline.get("text", ""),
                "url": xml_url,
                "description": outline.get("description", ""),
            }
            feeds.append(feed)

    return feeds
