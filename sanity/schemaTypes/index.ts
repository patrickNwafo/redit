import { type SchemaTypeDefinition } from "sanity";
import { userType } from "./userType";
import { postType } from "./postType";
import { commentType } from "./commentType";
import { votedType } from "./voteType";
import { subredditType } from "./subredditType";



export const schema: { types: SchemaTypeDefinition[] } = {
    types: [userType, postType, commentType, votedType, subredditType],
};
