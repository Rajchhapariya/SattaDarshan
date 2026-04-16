import { getCached, setCached } from "./redis";
export interface NewsArticle { title:string; url:string; source:string; publishedAt:string; description?:string; imageUrl?:string; }
export async function getPoliticianNews(name:string):Promise<NewsArticle[]> {
  const key = `news:${name.toLowerCase().replace(/\s+/g,"-")}`;
  const hit = await getCached<NewsArticle[]>(key);
  if (hit) return hit;
  const KEY = process.env.NEWSDATA_API_KEY;
  if (!KEY) return [];
  try {
    const res = await fetch(`https://newsdata.io/api/1/latest?apikey=${KEY}&q=${encodeURIComponent(`"${name}"`)}&country=in&language=en,hi&category=politics`,{next:{revalidate:21600}});
    const data = await res.json();
    const articles = (data.results??[]).slice(0,8).map((a:any)=>({title:a.title,url:a.link,source:a.source_name,publishedAt:a.pubDate,description:a.description,imageUrl:a.image_url}));
    await setCached(key, articles, 21600);
    return articles;
  } catch { return []; }
}
