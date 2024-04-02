const rotateBy90 = (prevRotation: number) => {
	return (prevRotation + Math.PI / 2) % (Math.PI * 2);
};

export { rotateBy90 };
