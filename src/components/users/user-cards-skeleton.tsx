import { Card, CardContent, CardTitle } from '../ui/card';
import { Skeleton } from '../ui/skeleton';

const UserCardsSkeleton = () => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col items-center gap-3">
          {/* Avatar Skeleton */}
          <Skeleton className="size-16 rounded-full" />

          <div className="text-center w-full">
            {/* Name Skeleton */}
            <CardTitle className="text-sm font-semibold">
              <Skeleton className="mx-auto h-4 w-24" />
            </CardTitle>

            {/* Email Skeleton */}
            <Skeleton className="mx-auto mt-1 h-3 w-32" />

            {/* Role badge skeleton */}
            <div className="mt-2 flex justify-center">
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserCardsSkeleton;
