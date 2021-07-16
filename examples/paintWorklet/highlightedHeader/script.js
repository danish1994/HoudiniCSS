if (CSS['paintWorklet'] !== undefined) {
    CSS.paintWorklet.addModule('highlighter.js').then(() => {
        console.log('Paint Worklet Loaded');
    });
} else {
    alert('Paint Worklet Not Supported!')
}
