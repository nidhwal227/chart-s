import { useState } from 'react';

function SearchBar({ symbol, setSymbol, displayRecent, changeDisplayRecent }) {

    const [userText, setUserText] = useState(symbol);

    function handleClick({ setSymbol, userText }) {
        setSymbol(userText);
    }

    return (
        <div className="flex flex-col">
            <div>
                < input className='bg-blue-200 px-2  mr-4'
                    type="text"
                    value={userText} placeholder="Enter symbol..."
                    onChange={(e) => setUserText(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            handleClick({ setSymbol, userText })
                        }
                    }}
                />
                <button onClick={() => handleClick({ setSymbol, userText })} className='bg-white rounded px-1'>
                    SEARCH
                </button>
            </div>
            <div>
                <input
                    type="checkbox"
                    checked={displayRecent}
                    onChange={(e) => changeDisplayRecent(e.target.checked)} />
                {' '}
                Only display recent data
            </div>

        </div>
    );
}
export default SearchBar;