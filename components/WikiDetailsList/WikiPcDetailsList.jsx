import styles from "./WikiPcDetailsList.module.scss";

const DetailItem = ({ data, name }) => {
	return (
		<li className={styles.item}>
			<div className={styles.title}>
				{name.split("").map((item) => (
					<span key={item}>{item}</span>
				))}
			</div>
			<div className={styles.text}>{data[name]}</div>
		</li>
	);
};

export default function WikiPcDetailsList(props) {
	const { data } = props;
	const infoKeys = Object.keys(data);

	if (!infoKeys) return null;
	return (
		<div v-if="data" className={styles.details}>
			<div className={styles.tips}>基本信息</div>
			<div className={styles.list}>
				<ul>
					{infoKeys.map((key) => (
						<DetailItem data={data} name={key} key={key} />
					))}
				</ul>
			</div>
		</div>
	);
}
