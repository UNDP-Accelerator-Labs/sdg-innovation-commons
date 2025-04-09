import DOMPurify from 'isomorphic-dompurify';

interface ResultsInfoProps {
    total: number;
    searchQuery: string;
    useNlp: boolean;
  }
  
  export default function ResultsInfo({ total, searchQuery, useNlp }: ResultsInfoProps) {
    return (
      <p className="font-space-mono text-sm mb-10">
        Showing {total} results{' '}
        {searchQuery && (
          <span
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(`for <strong>${searchQuery}</strong>`),
            }}
          />
        )}
        {useNlp && total > 0 && (
          <span> (ordered by relevance using semantic search)</span>
        )}
      </p>
    );
  }