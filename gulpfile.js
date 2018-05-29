const gulp = require('gulp');
const ts = require('gulp-typescript');

let tsProject = ts.createProject('tsconfig.json');

gulp.task("build", function () {
	let tsResult = gulp.src('src/**/*.ts')
		.pipe(tsProject());
	tsResult.js.pipe(gulp.dest('dist'));
});

gulp.task('dev', ['build'], () => {
	gulp.watch('src/**/*.ts', ['build']);
});