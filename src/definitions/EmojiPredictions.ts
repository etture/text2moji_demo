export interface EmojiPredictions {
    first?: EmojiProbPair,
    second?: EmojiProbPair,
    third?: EmojiProbPair,
    fourth?: EmojiProbPair,
    fifth?: EmojiProbPair
};

export interface EmojiProbPair {
    hexcode: string,
    probability: number
}