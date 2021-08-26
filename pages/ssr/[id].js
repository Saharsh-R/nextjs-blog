import Layout from "../../components/layout";
import Date from "../../components/date";
import utilStyles from "../../styles/utils.module.css";
import absoluteUrl from "next-absolute-url";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from 'next/router'

export default function Post({ postData, url }) {
    const router = useRouter()
	const handleDelete = async () => {

        await fetch(`${url}/api/posts/${postData.id}`, {
			method: "DELETE",
			
		});
		router.push(`/ssr/`)

    };
	return (
		<Layout ssr>
			<Head>
				<title>{postData.title}</title>
			</Head>
			<article>
				<h1 className={utilStyles.headingXl}>{postData.title}</h1>
				<div className={utilStyles.lightText}>
					<Date dateString={postData.date} />
				</div>
				<div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
			</article>

			<div style={{ display: "flex" }}>
				<Link href={`/ssr-edit/${postData.id}`}>
					<button style={{ width: "100%", padding: "20px", margin: "10px", border: "none", cursor: "pointer" }}>Edit</button>
				</Link>
				<button onClick={handleDelete} style={{ width: "100%", padding: "20px", margin: "10px", background: "red", color: "white", cursor: "pointer", border: "none" }}>
					Delete
				</button>
			</div>
		</Layout>
	);
}

export async function getServerSideProps({ params, req, res }) {
	const { origin } = absoluteUrl(req);

	const response = await fetch(`${origin}/api/posts/${params.id}`);

	if (!response.ok) {
		return {
			notFound: true,
		};
	}

	const data = await response.json();

	if (data) {
		return {
			props: {
				postData: data,
				url: origin,
			},
		};
	}
}
