import React from 'react';

const Header: React.FC = () => {
    return (
        <header className="bg-white text-on-surface p-4 border-b border-outline sticky top-0 z-10">
            <div className="flex items-center justify-between">
                <h1 className="text-xl font-medium">
                    Customer Opinion Miner
                </h1>
            </div>
        </header>
    );
};

export default Header;