import React, { FunctionComponent, useState, useEffect, useRef } from "react";
import "../../styles/langConfig.css";
import { observer } from "mobx-react";
import { useStore } from "../../Context";
import {
	Button,
	notification,
	Select,
	Spin,
	Progress,
	Space,
	Card,
	Form,
	Input,
} from "antd";

const ApiConfigPage: FunctionComponent = observer(() => {
	const store = useStore();
	const apiStore = store.apiStore;
	const [loading, setLoading] = useState(false);
	const [submitting, setSubmitting] = useState(false);
	const [posting, setPosting] = useState({
		nin: false,
		nita: false,
		sepa: false,
	});
	const [form] = Form.useForm();

	useEffect(() => {
		setLoading(true);
		apiStore.fetchDSValues().then(() => {
			setLoading(false);
			console.log("vals", { ...apiStore.values });
			form.setFieldsValue({ ...apiStore.values });
		});
	}, []);

	const onFinish = (values) => {
		setSubmitting(true);
		console.log("valzzz", values);
		apiStore
			.saveDSValues(values)
			.then(() => {
				notification.success({
					message: "API Settings updated successfully!",
					onClick: () => {},
					duration: 4,
				});
				store.showEvents();
			})
			.finally(() => {
				setSubmitting(false);
			});
	};

	const valuesChange = () => {};

	const handlePost = async (endp: string) => {
		setPosting((s) => ({ ...s, [endp]: true }));
		const values = form.getFieldsValue();
		const baseurl = values["base_url"];
		let tokenupdated = false;
		try {
			if (endp === "nin") {
				const res = await apiStore.postNinToken(baseurl, {
					username: values["nin_username"],
					password: values["nin_password"],
					method: values["nin_method"],
				});
				const token = res.token ?? res.data?.token;
				apiStore.setToken(token);
				tokenupdated = true;
			}

			if (endp === "nita") {
				await apiStore.postNitaClient(baseurl, {
					username: values["nita_username"],
					password: values["nita_password"],
					base_url: values["nita_baseurl"],
					token: values["nita_token"],
					method: values["nita_method"],
				});
			}

			if (endp === "sepa") {
				await apiStore.postSetPass(baseurl, {
					username: values["sepa_username"],
					password: values["sepa_password"],
					token: values["sepa_token"],
					method: values["sepa_method"],
				});
			}

			notification.success({
				message: "API Post was successful",
				onClick: () => {},
				duration: 4,
			});

			if (tokenupdated) {
				form.setFieldsValue({ ...apiStore.values });
				apiStore.saveDSValues(apiStore.values).then(() => {
					notification.success({
						message: "Token updated",
						onClick: () => {},
						duration: 4,
					});
				});
			}
		} catch (error) {
			setPosting((s) => ({ ...s, [endp]: false }));
			notification.error({
				message: "API Post failed!",
				description: error.toString(),
				onClick: () => {},
				duration: 4,
			});
		}

		setPosting((s) => ({ ...s, [endp]: false }));
	};

	return (
		<div className="lang-config-form-container">
			<Form
				form={form}
				name="death-certificate"
				layout="horizontal"
				labelCol={{ span: 6 }}
				wrapperCol={{ span: 18 }}
				onFinish={onFinish}
				className="lang-config-form w-100 mb-4"
				scrollToFirstError={true}
				initialValues={apiStore.values}
				onValuesChange={valuesChange}
			>
				<Card
					title="Configure API Settings"
					actions={[
						<Button
							htmlType="submit"
							type="primary"
							disabled={submitting}
							loading={submitting}
						>
							{submitting ? "Saving..." : "Save"}
						</Button>,
					]}
				>
					<Spin spinning={loading}>
						<Space direction="vertical" style={{ width: "100%" }} size={24}>
							<Card type="inner" title="Base URL">
								<Form.Item label="Base URL" name="base_url" className="">
									<Input size="large" />
								</Form.Item>
							</Card>
							<Card
								type="inner"
								title="Get NIN Token"
								actions={[
									<div
										style={{
											display: "flex",
											justifyContent: "flex-end",
											paddingRight: "24px",
										}}
									>
										<Button
											type="primary"
											disabled={posting.nin}
											loading={posting.nin}
											onClick={() => handlePost("nin")}
										>
											{posting.nin ? "Posting..." : "Post"}
										</Button>
									</div>,
								]}
							>
								<Form.Item
									label="Username"
									name="nin_username"
									className=""
								>
									<Input size="large" />
								</Form.Item>
								<Form.Item
									label="Password"
									name="nin_password"
									className=""
								>
									<Input size="large" />
								</Form.Item>
								<Form.Item label="Method" name="nin_method" className="">
									<Input size="large" />
								</Form.Item>
							</Card>
							<Card
								type="inner"
								title="Set NITA Client"
								actions={[
									<div
										style={{
											display: "flex",
											justifyContent: "flex-end",
											paddingRight: "24px",
										}}
									>
										<Button
											type="primary"
											disabled={posting.nita}
											loading={posting.nita}
											onClick={() => handlePost("nita")}
										>
											{posting.nita ? "Posting..." : "Post"}
										</Button>
									</div>,
								]}
							>
								<Form.Item
									label="Username"
									name="nita_username"
									className=""
								>
									<Input size="large" />
								</Form.Item>
								<Form.Item
									label="Password"
									name="nita_password"
									className=""
								>
									<Input size="large" />
								</Form.Item>
								<Form.Item
									label="Base URL"
									name="nita_baseurl"
									className=""
								>
									<Input size="large" />
								</Form.Item>
								<Form.Item label="Token" name="nita_token" className="">
									<Input size="large" />
								</Form.Item>
								<Form.Item label="Method" name="nita_method" className="">
									<Input size="large" />
								</Form.Item>
							</Card>
							<Card
								type="inner"
								title="Set Password"
								actions={[
									<div
										style={{
											display: "flex",
											justifyContent: "flex-end",
											paddingRight: "24px",
										}}
									>
										<Button
											type="primary"
											disabled={posting.sepa}
											loading={posting.sepa}
											onClick={() => handlePost("sepa")}
										>
											{posting.sepa ? "Posting..." : "Post"}
										</Button>
									</div>,
								]}
							>
								<Form.Item
									label="Username"
									name="sepa_username"
									className=""
								>
									<Input size="large" />
								</Form.Item>
								<Form.Item
									label="Password"
									name="sepa_password"
									className=""
								>
									<Input size="large" />
								</Form.Item>
								<Form.Item label="Token" name="sepa_token" className="">
									<Input size="large" />
								</Form.Item>
								<Form.Item label="Method" name="sepa_method" className="">
									<Input size="large" />
								</Form.Item>
							</Card>
						</Space>
					</Spin>
				</Card>
			</Form>
		</div>
	);
});

export default ApiConfigPage;
