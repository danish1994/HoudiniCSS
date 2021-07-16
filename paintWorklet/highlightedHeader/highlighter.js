registerPaint('highlighter', class {
    static get contextOptions() {
        return {alpha: true};
    }

    static get inputProperties() {
        return ['--highlightColor'];
    }

    paint(ctx, size, props) {
        const x = 0;
        const y = size.height * 0.3;
        const blockWidth = size.width * 0.33;
        const highlightHeight = size.height * 0.85;

        ctx.fillStyle = props.get('--highlightColor')[0] ? props.get('--highlightColor') : 'hsla(55, 90%, 60%, 1.0)';

        // block
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(blockWidth, y);
        ctx.lineTo(blockWidth + highlightHeight, highlightHeight);
        ctx.lineTo(x, highlightHeight);
        ctx.lineTo(x, y);
        ctx.closePath();
        ctx.fill();
        // dashes
        for (let i = 0; i < 4; i++) {
            let start = i * 2;
            ctx.beginPath();
            ctx.moveTo((blockWidth) + (start * 10) + 10, y);
            ctx.lineTo((blockWidth) + (start * 10) + 20, y);
            ctx.lineTo((blockWidth) + (start * 10) + 20 + (highlightHeight), highlightHeight);
            ctx.lineTo((blockWidth) + (start * 10) + 10 + (highlightHeight), highlightHeight);
            ctx.lineTo((blockWidth) + (start * 10) + 10, y);
            ctx.closePath();
            ctx.fill();
        }
    } // paint
});
