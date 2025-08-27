// frontend/my-app/src/services/recommendationService.js

export const recommendationService = {
  async getRecommendations(userId) {
    // Example: call backend API
    const response = await fetch(`/api/recommendations?userId=${userId}`);
    if (!response.ok) throw new Error("Failed to fetch recommendations");
    return await response.json();
  },
};
