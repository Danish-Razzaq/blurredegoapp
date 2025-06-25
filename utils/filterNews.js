// utils/filterNews.js
export const filterNews = (filterBy, filteredNews) => {
    let filteredNewsByDate = [];
    const today = new Date();
    const todayUTC = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));

    // console.log('Selected Filter:', filterBy); // To check the selected filter
    // console.log('Today UTC:', todayUTC.toISOString()); // Log today's UTC date
    if (filterBy === 'all') {
        filteredNewsByDate = filteredNews;
    } else if (filterBy === 'latest') {
        // Get the UTC date 4 days ago (to include today and yesterday in UTC)
        const lastTwoDaysUTC = new Date(todayUTC);
        lastTwoDaysUTC.setUTCDate(todayUTC.getUTCDate() - 3); // 3 days ago

        // Filter news based on whether the creation date is within the last 2 days
        filteredNewsByDate = filteredNews?.filter((blog) => {
            const blogDate = new Date(blog?.attributes?.createdAt); // Date from backend in UTC

            return blogDate >= lastTwoDaysUTC; // Compare dates in UTC
        });
    } else if (filterBy === 'thisWeek') {
        const lastWeekUTC = new Date(todayUTC);
        lastWeekUTC.setUTCDate(todayUTC.getUTCDate() - 7); // 7 days ago

        filteredNewsByDate = filteredNews?.filter((blog) => {
            const blogDate = new Date(blog?.attributes?.createdAt); // Date from backend in UTC
            return blogDate >= lastWeekUTC && blogDate <= todayUTC; // Compare in UTC
        });
    } else if (filterBy === 'previousMonth') {
        const lastMonthUTC = new Date(todayUTC);
        lastMonthUTC.setUTCDate(todayUTC.getUTCDate() - 30); // 30 days ago

        filteredNewsByDate = filteredNews?.filter((blog) => {
            const blogDate = new Date(blog?.attributes?.createdAt); // Date from backend in UTC
            return blogDate >= lastMonthUTC && blogDate <= todayUTC; // Compare in UTC
        });
    }

    // Final log to verify the result
    // console.log('Final Filtered News:', filteredNewsByDate);
    return filteredNewsByDate;
};

export const sortMembers = (members) => {
    // Sort filteredItems, giving priority to those with applicationMemberId
    const sortedItems = members.sort((a, b) => {
        const aHasId = !!a.applicationMemberId;
        const bHasId = !!b.applicationMemberId;

        if (aHasId && !bHasId) {
            return -1; // a comes first
        }
        if (!aHasId && bHasId) {
            return 1; // b comes first
        }

        // If both have IDs or both don't, sort by applicationMemberId
        if (aHasId && bHasId) {
            const parseApplicationId = (id) => {
                const parts = id.split('-');
                if (parts.length === 3) {
                    const year = parseInt(parts[1], 10); // Extract year
                    const serial = parseInt(parts[2], 10); // Extract serial number
                    return { year, serial };
                }
                return { year: -1, serial: -1 }; // Fallback for non-standard IDs
            };

            const aId = parseApplicationId(a.applicationMemberId);
            const bId = parseApplicationId(b.applicationMemberId);

            // Sort by year first, then serial
            if (aId.year !== bId.year) {
                return bId.year - aId.year; // Descending by year
            }
            return bId.serial - aId.serial; // Descending by serial
        }

        return 0; // No change in order
    });
    return sortedItems;
};
