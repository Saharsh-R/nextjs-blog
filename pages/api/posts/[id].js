import nc from "next-connect";
import posts from "../../../serverPosts/posts";

const getPost = (id) => posts.find((post) => post.id === id);

const handler = nc()
	.get((req, res) => {
		const post = getPost(req.query.id);
		if (!post) {
			res.status(404);
			return res.json("No such post found to get");
		}
		return res.json(post);
	})
	.delete((req, res) => {
		const id = req.query.id;

		const post = getPost(id);
		if (!post) {
			res.status(404);
			return res.json("No such post present to delete");
		}
		const i = posts.findIndex((post) => post.id === id);
		posts.splice(i, 1);
		return res.json("Post deleted");
	})
	.put((req, res) => {
		const id = req.query.id;
		const post = getPost(id);
		if (!post) {
			const newPost = { date: new Date().toISOString(), ...req.body };
			posts.push(newPost)
			return res.json(newPost)
		}
		const i = posts.findIndex((post) => post.id === id);
		const updatedPost = { ...post, ...req.body };
		posts[i] = updatedPost;
		return res.json(updatedPost);
	});

export default handler;
