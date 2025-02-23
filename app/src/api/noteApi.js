import { API_BASE_URL, fetchWithAuth } from "./fetchUtils";

// export const noteAPI = {
//   fetchNoteList: async (data) => {
// 		const res = fetchWithAuth(`/api/v1/note/list?page=${data.page}`, {
// 			headers: {
// 				"Content-Type": "application/json"
// 			}
// 		});
// 		// if (!res.ok) throw new Error("Failed to fetch note list");
//     // return res.json();
// 		const n = (data.page - 1) * 10;
// 		return {
// 		list: [
// 			{id: n + 1, title: `회의록${n + 1}`, deleted:false, checked: false},
// 			{id: n + 2, title: `회의록${n + 2}`, deleted:false, checked: false},
// 			{id: n + 3, title: `회의록${n + 3}`, deleted:false, checked: false},
// 			{id: n + 4, title: `회의록${n + 4}`, deleted:false, checked: false},
// 			{id: n + 5, title: `회의록${n + 5}`, deleted:false, checked: false},
// 			{id: n + 6, title: `회의록${n + 6}`, deleted:false, checked: false},
// 			{id: n + 7, title: `회의록${n + 7}`, deleted:false, checked: false},
// 			{id: n + 8, title: `회의록${n + 8}`, deleted:false, checked: false},
// 			{id: n + 9, title: `회의록${n + 9}`, deleted:false, checked: false},
// 			{id: n + 10, title: `회의록${n + 10}`, deleted:false, checked: false},
// 		]};
// 	}
// };

export const noteApi = {
  fetchNoteList: async ({ pageParam = 1 }) => {
		try {
			const res = fetchWithAuth(`/api/v1/note/list?page=${data.page}`, {
				headers: {
					"Content-Type": "application/json"
				}
			});
			// if (!res.ok) throw new Error("Failed to fetch note list");
			// return res.json();
		} catch(e) {
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
};