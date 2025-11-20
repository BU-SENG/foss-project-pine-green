import { NewsItem } from "@/lib/mockData";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bookmark, Clock, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";

interface NewsCardProps {
  news: NewsItem;
  onBookmark?: (id: string) => void;
}

const categoryColors: Record<string, string> = {
  Academic: "bg-primary/10 text-primary border-primary/20",
  Event: "bg-secondary/10 text-secondary border-secondary/20",
  Sport: "bg-success/10 text-success border-success/20",
  "Student Affairs": "bg-blue-500/10 text-blue-600 border-blue-500/20",
  Urgent: "bg-accent/10 text-accent border-accent/20",
  General: "bg-muted text-muted-foreground border-border",
  Administrative: "bg-purple-500/10 text-purple-600 border-purple-500/20",
};

export function NewsCard({ news, onBookmark }: NewsCardProps) {
  return (
    <div className="glass rounded-xl p-4 sm:p-6 hover-lift transition-smooth group touch-feedback">
      {news.priority === 'urgent' && (
        <div className="flex items-center gap-2 mb-3 text-accent animate-pulse-glow">
          <AlertCircle className="h-4 w-4" />
          <span className="text-sm font-semibold">Urgent</span>
        </div>
      )}
      
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <Badge variant="outline" className={`${categoryColors[news.category]} text-xs sm:text-sm`}>
              {news.category}
            </Badge>
            <Badge variant="outline" className="text-xs truncate max-w-[120px]">
              {news.department}
            </Badge>
          </div>
          <Link to={`/news/${news.id}`}>
            <h3 className="font-bold text-base sm:text-lg mb-2 group-hover:text-primary transition-smooth line-clamp-2">
              {news.title}
            </h3>
          </Link>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onBookmark?.(news.id)}
          className="shrink-0 h-10 w-10 sm:h-9 sm:w-9"
        >
          <Bookmark
            className={`h-5 w-5 ${news.isBookmarked ? 'fill-primary text-primary' : ''}`}
          />
        </Button>
      </div>

      <p className="text-muted-foreground text-sm sm:text-base mb-4 line-clamp-3">
        {news.excerpt}
      </p>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
        <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground min-w-0">
          <span className="text-base sm:text-xl shrink-0">{news.author?.avatar || '👤'}</span>
          <span className="truncate">{news.author?.name || 'Unknown Author'}</span>
        </div>
        <div className="flex items-center gap-1 text-xs sm:text-sm text-muted-foreground shrink-0">
          <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
          <span>{formatDistanceToNow(news.publishedAt, { addSuffix: true })}</span>
        </div>
      </div>
    </div>
  );
}
