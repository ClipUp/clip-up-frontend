
const AudioController = ({ audioUrl }) => {

  return (
    <div>
			<audio controls src={audioUrl}></audio>
    </div>
  );
};

export default AudioController;