import { API_BASE_URL, fetchWithAuth } from "./fetchUtils";

export const noteAPI = {
  fetchNoteList: async ({ lastMeetingId, limit = 10 }) => {
		try {
			const query = new URLSearchParams();
			let queryStr = "";
			if (lastMeetingId) query.set("lastMeetingId", lastMeetingId);
			if (limit) query.set("limit", limit);
			const querStr = query.toString();
			const res = await fetchWithAuth(`/api/v1/meetings${queryStr ?? ("?" + queryStr)}`, {
				headers: {
					"Content-Type": "application/json"
				}
			});
			console.log(res);
			if (!res.ok) throw new Error("Failed to fetch note list");
			return res;
		} catch(e) {
			console.log(e);
			const n = (pageParam - 1) * 10;
			const notes = Array.from({ length: 10 }, (_, index) => ({
				id: n + index + 1,
				title: `회의록${n + index + 1}`,
				deleted: false,
				checked: false,
			}));

			const hasNextPage = pageParam < 5; // 총 5페이지까지 있다고 가정
			return {
				list: notes,
				nextPage: hasNextPage ? pageParam + 1 : null,
			};
		}
  },
  createNote: async (data) => {
    const res = await fetch(`${API_BASE_URL}/api/v1/meetings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: 'include',
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to create user");
    return res.json();
  },
};