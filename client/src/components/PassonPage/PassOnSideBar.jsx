import Conversations from './Conversations';
import SearchInput from './SearchInput';

const PassOnSideBar = () => {
  return (
    <div className="border-2 border-slate-500/50 rounded-lg  p-4 mt-2 ml-2 flex flex-col">
      <SearchInput />

      <div className="overflow-y-auto">
        <Conversations />
      </div>
    </div>
  );
};

export default PassOnSideBar;
