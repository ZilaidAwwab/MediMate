export const saveConversation = (conversation) => {
    const conversations = JSON.parse(localStorage.getItem('conversations') || '[]');
    conversations.push(conversation);
    localStorage.setItem('conversations', JSON.stringify(conversations));
};

export const getConversations = () => {
    return JSON.parse(localStorage.getItem('conversations') || []);
};

// removing conversations automatically after a week
setInterval(() => {
    const conversations = getConversations();
    const updatedConversations = conversations.filter((conversation) => conv => new Date() - new Date(conv.timestamp) < 7 * 24 * 60 * 60 * 1000);
    localStorage.setItem('conversations', JSON.stringify(updatedConversations));
}, 24 * 60 * 60 * 1000); // run daily
