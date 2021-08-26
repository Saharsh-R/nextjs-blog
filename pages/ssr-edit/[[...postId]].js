import absoluteUrl from "next-absolute-url";
import utilStyles from "../../styles/utils.module.css";
import Link from "next/link";
import Layout, { siteTitle } from "../../components/layout";
import Head from "next/head";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function Edit({ postData, url }) {
	const router = useRouter();
	const [id, setId] = useState("");
	const [title, setTitle] = useState("");
	const [contentHtml, setContentHtml] = useState("");
	const [date, setDate] = useState(new Date().toISOString().substring(0, 10));

	let inputDisabled = postData ? true : false;

	useEffect(() => {
		if (postData) {
			setId(postData.id);
			setTitle(postData.title);
			setContentHtml(postData.contentHtml);
			setDate(postData.date.substring(0, 10));
		}
	}, []);

	const handleSubmit = async (e) => {
		e.preventDefault();
		await fetch(`${url}/api/posts/${id}`, {
			method: "PUT",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ id, title, contentHtml, date }),
		});
		router.push(`/ssr/${id}`);
	};

	return (
		<Layout>
			<Head>
				<title>SSR Edit</title>
			</Head>

			<section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
				<h2 className={utilStyles.headingLg}>Post Editor</h2>
				<form onSubmit={handleSubmit}>
					<div style={{ display: "flex", flexDirection: "column" }}>
						<div style={{ display: "flex", justifyContent: "space-evenly" }}>
							<div style={{ flex: "1" }}>
								<label>id </label>
								<input value={id} disabled={inputDisabled} onChange={(e) => setId(e.target.value)} style={{ width: "80%" }} type="text" required></input>
							</div>

							<div>
								<label>date </label>
								<input
									value={date}
									onChange={(e) => {
										setDate(e.target.value);
										console.log(date);
									}}
									type="date"
									required
								></input>
							</div>
						</div>
						<br />
						<div style={{ display: "flex", flexDirection: "column" }}>
							<label>title</label>
							<input value={title} onChange={(e) => setTitle(e.target.value)} type="text" required></input>
						</div>
						<br />
						<div style={{ display: "flex", flexDirection: "column" }}>
							<label>contentHtml</label>
							<textarea value={contentHtml} onChange={(e) => setContentHtml(e.target.value)} type="text" rows="10" style={{ resize: "vertical" }} required></textarea>
						</div>
						<br />
						<input style={{ width: "100%", padding: "20px", border: "none", cursor: "pointer" }} type="submit" value="Submit" />
					</div>
				</form>
			</section>
		</Layout>
	);
}

export async function getServerSideProps({ params, req, res }) {
	const { origin } = absoluteUrl(req);

	let postId = params.postId;
	if (!postId) {
		return {
			props: {
				url: origin,
			},
		};
	}
	postId = postId[0];

	const response = await fetch(`${origin}/api/posts/${postId}`);
	if (!response.ok) {
		return {
			notFound: true,
		};
	}
	const postData = await response.json();

	return {
		props: {
			postData,
			url: origin,
		},
	};
}
