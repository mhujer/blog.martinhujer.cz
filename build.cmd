del /S /Q output_dev\*
start chrome http://localhost:8000
php ../sculpin/bin/sculpin generate --watch --server
