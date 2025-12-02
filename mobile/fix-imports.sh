#!/bin/bash

echo "🔧 Fixing imports in all screen files..."

# Replace react-native-linear-gradient with expo-linear-gradient
find mobile/src/screens -name "*.tsx" -type f -exec sed -i '' 's/react-native-linear-gradient/expo-linear-gradient/g' {} +

# Replace react-native-vector-icons with @expo/vector-icons
find mobile/src/screens -name "*.tsx" -type f -exec sed -i '' "s/import Icon from 'react-native-vector-icons\/MaterialCommunityIcons'/import { MaterialCommunityIcons as Icon } from '@expo\/vector-icons'/g" {} +

echo "✅ Imports fixed!"
echo ""
echo "Now run:"
echo "  cd mobile"
echo "  rm -rf node_modules"
echo "  npm install"
echo "  npx expo start --clear"
