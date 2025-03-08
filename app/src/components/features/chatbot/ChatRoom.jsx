import { useEffect, useRef, useState } from "react"
import AiChat  from "../../../assets/icon/ai_chat.svg"
import ChatSend  from "../../../assets/icon/chat_send.svg"
import AiProfile  from "../../../assets/icon/chat_ai_profile.svg"
import ChatLoading  from "../../../assets/lottie/chat_loading.json"
import "./chatRoom.scss"
import { useSendAiChat } from "../../../hooks/useNote"
import Lottie from "lottie-react"

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

const GuideBubble = ({children, onClick}) => {
	return (
		<button type="button" className="guide-bubble" onClick={onClick}>{children}</button>
	)
}

const ChatRoom = ({noteId}) => {
	const guideQ = [
		{message: "To-Do list 정리해줘"},
		{message: "이 회의 요약을 좀 더 짧게 해줘"}
	];
	const [chatList, setChatList] = useState([
		{sender: "ai", message: "안녕하세요! 👋 해당 회의에서 중요한 내용을 알려드릴게요. 어떤 게 궁금하세요?"}
	]);
	const [message, setMessage] = useState("");
	const [loading, setLoading] = useState(false);
	const [lastSessionId, setLastSessionId] = useState(null);
	const scrollDownRef = useRef();
	const sendMutation = useSendAiChat();

	useEffect(() => {
		scrollDown();
	}, [loading, chatList]);

	const scrollDown = () => {
		scrollDownRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
	};
	const handleKeyDown = (event) => {
		if (event.key === "Enter") {
		event.preventDefault();
		sendMessage(message);
		}
	};
	const sendMessage = async (message) => {
		setMessage("");
		setChatList(prev => [...prev, { sender: "me", message: message }]);

		setLoading(true);
		const res = await sendMutation.mutateAsync({meetingId: noteId, question: message, sessionId: lastSessionId});
		const formattedText = res.data.answer
			.split("\n")
			.map((line, index) => (
				<p key={`text${index}`}>
					{line}
				</p>
			));
		setChatList(prev => [...prev, {sender: "ai", message: formattedText}]);
		setLastSessionId(res.data.sessionId);
		setLoading(false);
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
					{
						loading && (
							<ChatBubble senderProfile={AiProfile}>
								<Lottie className="loading-lottie" animationData={ChatLoading} loop={true} autoplay />
							</ChatBubble>
						)
					}
					{
						chatList.length === 1 && (
						<div className="guide-bubble-list">
							{
								guideQ.map((q, idx) => (
									<GuideBubble key={idx} onClick={() => sendMessage(q.message)}>{q.message}</GuideBubble>
								))
							}
						</div>
					)}
					<div ref={scrollDownRef} />
				</div>
			</div>
			<div className="chat-input-group">
				<input placeholder={loading ? "AI가 답변을 생성 중입니다..." : "무엇이든 물어보세요"} value={message}
					onChange={(e) => setMessage(e.target.value)}
					onKeyDown={handleKeyDown}
					disabled={loading}
				></input>
				<button type="button" className="chat-send-button" onClick={() => sendMessage(message)} disabled={loading || !message}>
					<img src={ChatSend} />
				</button>
			</div>
		</div>
	)
}

export {ChatButton, ChatBubble, ChatRoom};