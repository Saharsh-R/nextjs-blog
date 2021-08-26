import nc from "next-connect";
import posts from "../../../serverPosts/posts";

const handler = nc()
	.get((req, res) => {
		res.json(posts);
	})
	

export default handler;
