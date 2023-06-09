import { Layout } from "@/components/Layout/Layout";
import DevBadge from "@/components/parts/DevBadge";
import Policy from "@/components/parts/Policy";
import ReducedCard from "@/components/parts/ReducedCard";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import TypographyH3 from "@/components/ui/typography/h3";
import TypographyH4 from "@/components/ui/typography/h4";
import TypographyP from "@/components/ui/typography/p";
import { cn } from "@/lib/utils";
import { api } from "@/utils/api";
import { IconDots, IconFlag, IconPencil } from "@tabler/icons-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function User() {
  const router = useRouter();
  const user = api.users.single.useQuery({ id: String(router.query.id) });
  const { data } = useSession();

  const userResources = user.data?.resources?.map((resource, index) => (
    <ReducedCard
      key={index}
      name={resource.title}
      url={resource.uri}
      image={resource.image}
    />
  ));

  const noResourcesAvailable = (
    <TypographyP>{user.data?.name} has no resources available</TypographyP>
  );

  const userResourcesOrMessage = userResources?.length
    ? userResources
    : noResourcesAvailable;

  const isDeveloper = user.data && user.data.permissions === 1;
  const hasDisplayName = user.data && user.data.displayName;

  useEffect(() => {
    if (user.isError || user.error) {
      router.push("/");
    }
  }, [user.isError, user.error, router]);
  return (
    <Layout title={user.data?.displayName! || user.data?.name!}>
      <div className="mx-auto max-w-3xl">
        <div className="overflow-hidden rounded-2xl border bg-slate-200 dark:border-slate-700 dark:bg-slate-800">
          <div
            className="h-[200px] w-full bg-cover bg-no-repeat"
            style={{
              backgroundColor: user.data?.bannerColor ?? "rgb(30 41 59)",
              backgroundImage: user.data?.banner ?? undefined,
            }}
          />
          <div className="p-6">
            <div className="relative flex justify-between">
              <div className="-mt-20 h-24 w-24 rounded-full bg-slate-200 ring-8 ring-slate-200 dark:bg-slate-800 dark:ring-slate-800">
                {user.isLoading ? null : (
                  <Image
                    alt="user avatar"
                    width={96}
                    height={96}
                    src={user.data?.image ?? ""}
                    className="rounded-full"
                  />
                )}
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant={"ghost"} className="rounded-full p-2">
                    <IconDots className="h-6 w-6" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="mr-10 dark:bg-slate-900">
                  <DropdownMenuItem
                    className="flex justify-between"
                    disabled={user.data?.id === data?.user.id}
                  >
                    Report <IconFlag className="h-4 w-4" />
                  </DropdownMenuItem>
                  <Policy policy={data?.user.id === user.data?.id}>
                    <Link href="/u/edit">
                      <DropdownMenuItem className="flex justify-between">
                        Edit <IconPencil className="h-4 w-4" />
                      </DropdownMenuItem>
                    </Link>
                  </Policy>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="mt-0">
              <div className="flex flex-col">
                <div>
                  <div className="mb-2 flex flex-col gap-1">
                    <TypographyH3 className="flex items-center">
                      {hasDisplayName
                        ? user.data?.displayName
                        : user.data?.name}{" "}
                      {isDeveloper && (
                        <DevBadge
                          color={user.data?.bannerColor ?? "rgb(30 41 59)"}
                        />
                      )}
                    </TypographyH3>
                  </div>
                  {user.data?.bio && (
                    <TypographyP className="mb-2 mt-1 border-l-2 border-l-slate-500 pl-2 text-slate-700 dark:!text-slate-300">
                      {user.data.bio}
                    </TypographyP>
                  )}
                  <TypographyP>
                    {user.data?.name || "User"} has submitted{" "}
                    {user.data?.resources?.length || 0} resources
                  </TypographyP>
                </div>
              </div>
            </div>
            {user.data && user.data.preferences?.showResources && (
              <div className="mt-4">
                <Accordion
                  type="single"
                  collapsible
                  className="w-full rounded-lg bg-slate-300 px-3 dark:bg-slate-700"
                >
                  <AccordionItem value="item-1">
                    <AccordionTrigger>Resources</AccordionTrigger>
                    <AccordionContent className="p-2">
                      <div
                        className={cn(
                          user.data.resources.length && "grid grid-cols-4 gap-2"
                        )}
                      >
                        {userResourcesOrMessage}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
