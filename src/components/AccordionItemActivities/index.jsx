import PropTypes from 'prop-types';

export const AccordionActivities = ({ activity, parent }) => {
	return (
		<div className="accordion-item">
			<h2 className="accordion-header" id={'heading' + activity.id}>
				<button
					className="accordion-button collapsed"
					type="button"
					data-bs-toggle="collapse"
					data-bs-target={'#collapse' + activity.id}
					aria-expanded="false"
					aria-controls={'collapse' + activity.id}
				>
					{activity.name}
				</button>
			</h2>
			<div
				id={'collapse' + activity.id}
				className="accordion-collapse collapse"
				aria-labelledby={'heading' + activity.id}
				data-bs-parent={parent}
			>
				<div className="accordion-body">
					<strong>This is the second accordion body.</strong> It is hidden by default, until the collapse plugin adds
					the appropriate classes that we use to style each element. These classes control the overall appearance, as
					well as the showing and hiding via CSS transitions. You can modify any of this with custom CSS or overriding
					our default variables. s also worth noting that just about any HTML can go within the{' '}
					<code>.accordion-body</code>, though the transition does limit overflow.
				</div>
			</div>
		</div>
	);
};

AccordionActivities.propTypes = {
	activity: PropTypes.object.isRequired,
	parent: PropTypes.string.isRequired,
};
