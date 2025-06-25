import IconMenuDashboard from "@/public/icon/menu/icon-menu-dashboard";
import IconMenuForms from "@/public/icon/menu/icon-menu-forms";
import IconMenuInvoice from "@/public/icon/menu/icon-menu-invoice";
import IconMenuMembers from "@/public/icon/menu/icon-menu-members";
import IconMenuNotes from "@/public/icon/menu/icon-menu-notes";
import { IoNewspaperOutline } from "react-icons/io5";

export const MenuItemsList = [
    {
        path: '/dashboard',
        label: 'Dashboard',
        icon: <IconMenuDashboard className="shrink-0 group-hover:!text-primary" />,
        roles: ['manager', 'management'], 
    },
    {
        path: '/apps/users',
        label: 'Users',
        icon: <IconMenuMembers className="shrink-0 group-hover:!text-primary" />,
        roles: ['manager'], 
    },
    {
        path: '/apps/application',
        label: 'Applications',
        icon: <IconMenuForms className="shrink-0 group-hover:!text-primary" />,
        roles: ['manager'],
    },
    {
        path: '/apps/members',
        label: 'Members',
        icon: <IconMenuMembers className="shrink-0 group-hover:!text-primary" />,
        roles: ['manager', 'management'],
    },
    {
        path: '/apps/invoice',
        label: 'Invoice',
        icon: <IconMenuInvoice className="shrink-0 group-hover:!text-primary" />,
        roles: ['manager'],
    },
    {
        path: '/apps/reviewedit',
        label: 'Review Edits',
        icon: <IconMenuNotes className="shrink-0 group-hover:!text-primary" />,
        roles: ['manager'],
    },
    {
        path: '/apps/news',
        label: 'News',
        icon: <IoNewspaperOutline className="shrink-0 group-hover:!text-primary" />,
        roles: ['manager'],
    },
    {
        path: '/apps/events',
        label: 'Events',
        icon: <IconMenuNotes className="shrink-0 group-hover:!text-primary" />,
        roles: ['manager', 'management'],
    },
];
