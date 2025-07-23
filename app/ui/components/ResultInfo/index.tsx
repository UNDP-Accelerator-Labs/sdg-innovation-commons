import DOMPurify from 'isomorphic-dompurify';
import Tooltip from '@/app/ui/components/Tooltip';

interface ResultsInfoProps {
  total: number;
  searchQuery: string;
  useNlp: boolean;
}

export default function ResultsInfo({
  total,
  searchQuery,
  useNlp,
}: ResultsInfoProps) {
  return (
    <p className="mb-5 font-space-mono text-sm">
      Showing {total} results{' '}
      {searchQuery && (
        <span
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(`for <strong>${searchQuery}</strong>`),
          }}
        />
      )}
      {useNlp && total > 0 && (
        <>
          <span> (ordered by relevance using semantic search).</span>
          <Tooltip
            content={
              <>
                <div>
                  Semantic search uses advanced AI to understand the meaning
                  behind your query and returns results ordered by relevance,
                  not just keyword matches. 
                  Semantic search does not select documents; rather, it ranks them. Each search returns all documents in the database, ranked in terms of proximity to the search term. For this reason, semantic search is not an appropriate tool to count documents in the database. It cannot, by itself, answer questions such as "how many solutions have the Accelerator Labs mapped that involve machines for agriculture?". What it does best is answer questions of proximity. What are the documents in my database that most closely fit my query?
                </div>
                <div className="mt-2">
                  <a
                    href="https://github.com/UNDP-Accelerator-Labs/sdg-innovation-commons/wiki/Search"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-teal-600 underline"
                  >
                    Learn more about semantic search in SDG Commons
                  </a>
                </div>
              </>
            }
            placement="bottom"
            trigger="click"
          >
            <span className="ml-1 cursor-pointer underline decoration-dotted">
              What does this mean?
            </span>
          </Tooltip>
        </>
      )}
    </p>
  );
}
