import React from 'react';
import { NewsArticle, AdBanner } from '../types';
import { ArticleReaderPage } from './ArticleReaderPage';

interface ArticleReaderModalProps {
  article: NewsArticle | null;
  onClose: () => void;
  isBookmarked: boolean;
  onToggleBookmark: (article: NewsArticle) => void;
  onShowToast: (msg: string) => void;
  ads?: AdBanner[];
  monetizationEnabled?: boolean;
}

export const ArticleReaderModal: React.FC<ArticleReaderModalProps> = ({
  article,
  onClose,
  isBookmarked,
  onToggleBookmark,
  onShowToast,
  ads = [],
  monetizationEnabled = false,
}) => {
  if (!article) return null;

  return (
    <ArticleReaderPage
      article={article}
      onBack={onClose}
      isBookmarked={isBookmarked}
      onToggleBookmark={onToggleBookmark}
      onShowToast={onShowToast}
      ads={ads}
      monetizationEnabled={monetizationEnabled}
    />
  );
};
