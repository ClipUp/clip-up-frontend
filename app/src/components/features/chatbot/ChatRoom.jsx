import { useState } from "react"
import AiChat  from "../../../assets/icon/ai_chat.svg"
import ChatSend  from "../../../assets/icon/chat_send.svg"
import AiProfile  from "../../../assets/icon/chat_ai_profile.svg"
import "./chatRoom.scss"
import { useSendAiChat } from "../../../hooks/useNote"

const ChatButton = ({isOpen, setIsOpen}) => {
	return (
		<button
			className={`chat-button
				${isOpen ? "active" : ""}
			`}
			onClick={() => setIsOpen(!isOpen)}
		>
			<img src={AiChat}/>
			<span className="chat-button-title">
				AI 채팅
			</span>
		</button>
	)
}

const ChatBubble = ({senderProfile, children}) => {
	return (
		<div className="chat-bubble">
			{senderProfile && (
				<div className="chat-bubble-profile">
					<img src={senderProfile}/>
				</div>
			)}
			<div
				className={`chat-bubble-message
					${!senderProfile ? "me" : ""}
				`}
			>
				<div>
					{children}
				</div>
			</div>
		</div>
	)
}

const GuideBubble = ({children}) => {
	return (
		<button type="button" className="guide-bubble">{children}</button>
	)
}

const ChatRoom = ({noteId}) => {
	const [chatList, setChatList] = useState([
		{sender: "ai", message: "안녕하세요! 👋 해당 회의에서 중요한 내용을 알려드릴게요. 어떤 게 궁금하세요?"}
	]);
	const guideQ = [
		{message: "이번 회의의 핵심 결론이 뭐야?"},
		{message: "내가 해야 할 일만 뽑아서 정리해줘"},
		{message: "이 회의 요약을 좀 더 짧게 해줘"}
	];
	const sendMutation = useSendAiChat();
	const handleSendButton = async () => {
		const res = await sendMutation.mutateAsync({meetingId: noteId, question: "test"});
		console.log (res);
		setChatList({sender: "ai", message: res.data.answer});
	}

	return (
		<div className="chat-room">
			<div className="chat-list-group">
				<div className="chat-bubble-list">
					{
						chatList.map((chat, idx) => (
							<ChatBubble key={idx} senderProfile={chat.sender === "ai" ? AiProfile : ""}>{chat.message}</ChatBubble>
						))
					}
				</div>
				{
					chatList.length === 1 && (
					<div className="guide-bubble-list">
						{
							guideQ.map((q, idx) => (
								<GuideBubble key={idx}>{q.message}</GuideBubble>
							))
						}
					</div>
				)}
			</div>
			<div className="chat-input-group">
				<input placeholder="무엇이든 물어보세요"></input>
				<button type="button" className="chat-send-button" onClick={handleSendButton}>
					<img src={ChatSend} />
				</button>
			</div>
		</div>
	)
}

export {ChatButton, ChatBubble, ChatRoom};