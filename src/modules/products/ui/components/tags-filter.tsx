import { Checkbox } from '@/components/ui/checkbox';
import { DEFAULT_LIMIT } from '@/constants';
import { useTRPC } from '@/trpc/client';
import { useInfiniteQuery } from '@tanstack/react-query';
import { LoaderIcon } from 'lucide-react';

// TagsFilterProps - Props for the TagsFilter component
interface TagsFilterProps {
  value?: string[] | null; // Currently selected tag names
  onChange: (value: string[]) => void; // Callback when tag selection changes
}

// TagsFilter - Renders a list of tag filters using checkboxes with infinite loading
export const TagsFilter = ({ value, onChange }: TagsFilterProps) => {
  const trpc = useTRPC();

  // Fetches tags in paginated form using TRPC
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery(
      trpc.tags.getMany.infiniteQueryOptions(
        {
          limit: DEFAULT_LIMIT, // Number of tags to fetch per page
        },
        {
          // Returns the nextPage number if there are more docs, otherwise returns undefined to stop pagination
          getNextPageParam: (lastPage) => {
            return lastPage.docs.length > 0 ? lastPage.nextPage : undefined;
          },
        }
      )
    );

  // onClick - Handles toggling tag selection
  const onClick = (tag: string) => {
    if (value?.includes(tag)) {
      // If tag is already selected, remove it
      onChange(value?.filter((t) => t !== tag) || []);
    } else {
      // Otherwise, add the tag to the selection
      onChange([...(value || []), tag]);
    }
  };

  return (
    <div className='flex flex-col gap-y-2'>
      {/* Show loading indicator while fetching tags */}
      {isLoading ? (
        <div className='flex items-center justify-center p-4'>
          <LoaderIcon className='size-4 animate-spin' />
        </div>
      ) : (
        // Render tags from all loaded pages
        data?.pages.map((page) =>
          page.docs.map((tag) => (
            <div
              key={tag.id}
              className='flex items-center justify-between cursor-pointer'
              onClick={() => onClick(tag.name)} // Toggle tag on click
            >
              <p className='font-medium'>{tag.name}</p>
              <Checkbox
                checked={value?.includes(tag.name)} // Controlled checkbox state
                onCheckedChange={() => onClick(tag.name)} // Also toggle via checkbox
              />
            </div>
          ))
        )
      )}

      {/* Load more tags if available */}
      {hasNextPage && (
        <button
          disabled={isFetchingNextPage}
          onClick={() => fetchNextPage()}
          className='underline font-medium justify-start text-start disabled:opacity-50 cursor-pointer'
        >
          Load more...
        </button>
      )}
    </div>
  );
};
