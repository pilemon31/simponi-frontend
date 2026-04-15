import type { ProfileResponseData } from '@/types/user.type';
import { Card, CardContent, CardTitle } from '../ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';

const UserCards = ({ user }: { user: ProfileResponseData }) => {
  const getInitials = (name: string) => {
    const names = name.split(' ');
    const initials = names.map((n) => n.charAt(0).toUpperCase()).join('');
    return initials;
  };

  return (
    <Card className="py-4">
      <CardContent>
        <div className="grid grid-cols-5 items-center pb-4">
          {user.image_url ? (
            <img
              src={user.image_url}
              alt="User Avatar"
              className="text-gray-500 size-8 col-span-2"
            />
          ) : (
            <Avatar className="size-8">
              <AvatarImage
                src={user.image_url || '/avatars/shadcn.jpg'}
                alt={user.email}
              />
              <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
            </Avatar>
          )}
          <CardTitle className="text-xs font-semibold">
            {user.email}
            <p className="text-xs text-muted-foreground">{user.role.name}</p>
          </CardTitle>
        </div>
        <Button
          variant="ghost"
          className="
            relative w-full overflow-hidden
            border rounded-md border-gray-400
            text-black
            transition-colors duration-300
            group
          "
        >
          <span
            className="
              absolute inset-0 bg-black
              translate-x-[-100%]
              group-hover:translate-x-0
              transition-transform duration-500 ease-in-out
            "
          />
          <span className="relative z-10 group-hover:text-white transition-colors duration-300">
            Masuk
          </span>
        </Button>
      </CardContent>
    </Card>
  );
};

export default UserCards;
