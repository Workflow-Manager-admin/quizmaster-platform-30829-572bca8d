#!/bin/bash
cd /home/kavia/workspace/code-generation/quizmaster-platform-30829-572bca8d/quizmaster_platform
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

