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
			return res.data;
		} catch(e) {
			console.log(e);
			return [];
		}
  },
  createNote: async (data) => {
		console.log("Audio Blob before append:", data);
    console.log("Is Audio Blob a Blob?:", data instanceof Blob);
		const formData = new FormData();
    formData.append("audioFile", data, "recording.wav")

    const res = await fetch(`${API_BASE_URL}/api/v1/meetings`, {
      method: "POST",
      credentials: 'include',
      body: formData,
    });
    return res.json();
  },
};