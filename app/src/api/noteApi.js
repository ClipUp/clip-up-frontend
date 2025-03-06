import { API_BASE_URL, fetchWithAuth } from "./fetchUtils";

export const noteAPI = {
  fetchNoteList: async ({ lastMeetingId, limit = 10, status }) => {
    try {
      const path = (status === "all") ? "/api/v1/meetings" : "/api/v1/meetings/trash";
      const query = new URLSearchParams();

      if (lastMeetingId) {
        query.set("lastMeetingId", lastMeetingId);
      }
      if (limit) {
        query.set("limit", limit);
      }

      const queryStr = query.toString();
      const res = await fetchWithAuth(`${path}?${queryStr}`, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      return res.data;
    } catch (e) {
      console.log(e);
      return [];
    }
  },
  createNote: async ({ audioFile, audioFileDuration }) => {
		const formData = new FormData();
    formData.append("audioFile", audioFile, "recording.wav");
		formData.append("audioFileDuration", audioFileDuration);

    const res = await fetchWithAuth("/api/v1/meetings", {
      method: "POST",
      body: formData,
    });
    return await res;
  },
	getNote: async ({ meetingId }) => {
    const res = await fetchWithAuth(`/api/v1/meetings/${meetingId}`, {
			headers: {
				"Content-Type": "application/json"
			}
    });
    return await res;
  },
	deleteNote: async ({ meetingIds }) => {
		const res = await fetchWithAuth(`/api/v1/meetings`, {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ meetingIds }),
		});

		return await res;
	},
	cancleDeleteNote: async ({ meetingIds }) => {
		const res = await fetchWithAuth(`/api/v1/meetings/trash`, {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ meetingIds }),
		});

		return await res;
	},
	editNote: async ({ meetingId, title }) => {
		const res = await fetchWithAuth(`/api/v1/meetings/${meetingId}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ title }),
		});

		return await res;
	},
	sendAiChat: async ({ meetingId, question, sessionId }) => {
    const res = await fetchWithAuth(`/api/v1/meetings/${meetingId}/chat`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({ question, sessionId }),
    });
    return await res;
  },
};