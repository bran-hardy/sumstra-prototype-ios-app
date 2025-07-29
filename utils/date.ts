export const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
};

export const isThisMonth = (dateString: string): boolean => {
    const date = new Date(dateString);
    const now = new Date();
    return date.getMonth() === now.getMonth() && 
           date.getFullYear() === now.getFullYear();
};

export const getMonthYear = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
    });
};