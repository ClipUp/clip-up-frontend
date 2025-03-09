import NoteListTemplate from '../features/note/NoteListTemplate';
import { useDeletedNoteList } from '../../hooks/useNote';
import EmptyNoticeList from '../features/note/EmptyNoticeList';

const DeletedNoteList = () => {

	return (
		<section>
			<NoteListTemplate
				key="deletedNoteList"
				title="휴지통"
				useNoteList={useDeletedNoteList}
				height={window.innerHeight - 230}
				empty={<EmptyNoticeList title="휴지통이 비어있습니다" />}
				menuIdList={["cancle_delete"]}
			/>
		</section>
	);
}

export default DeletedNoteList;