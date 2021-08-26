import absoluteUrl from "next-absolute-url";
import utilStyles from "../../styles/utils.module.css";
import Link from "next/link";
import Date from "../../components/date";
import Layout, { siteTitle } from "../../components/layout";
import Head from "next/head";

export default function SsrPosts({ allPostsData }) {
	return (
		<Layout>
			<Head>
				<title>SSR Blogs</title>
			</Head>

			<section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
				<h2 className={utilStyles.headingLg}>Server Side Rendered Blogs</h2>
				<ul className={utilStyles.list}>
					{allPostsData.map(({ id, date, title }) => (
						<li className={utilStyles.listItem} key={id}>
							<Link href={`/ssr/${id}`}>
								<a>{title}</a>
							</Link>
							<br />
							<small className={utilStyles.lightText}>
								<Date dateString={date} />
							</small>
						</li>
					))}
				</ul>
			</section>

			<Link href={`/ssr-edit/`}>
				<button style={{ width: "100%", padding: "20px"  ,cursor: 'pointer', border: 'none'}}>Create a new Blog</button>
			</Link>
		</Layout>
	);
}

export async function getServerSideProps({ req, res }) {
	const { origin } = absoluteUrl(req);
	const response = await fetch(`${origin}/api/posts`);
	const allPosts = await response.json();

	return {
		props: { allPostsData: allPosts },
	};
}
