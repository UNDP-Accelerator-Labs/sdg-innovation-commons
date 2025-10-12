#!/bin/bash

# Anti-Bot Protection Verification Script
# This script checks that the anti-bot protection code is properly implemented

echo "==================================="
echo "Anti-Bot Protection Verification"
echo "==================================="
echo ""

ERRORS=0

# Check 1: Verify honeypot field in Contact form
echo "✓ Checking Contact Us form honeypot implementation..."
if grep -q "name='website'" app/ui/components/Contact/index.tsx; then
    echo "  ✓ Honeypot field found in Contact form UI"
else
    echo "  ✗ ERROR: Honeypot field missing from Contact form UI"
    ERRORS=$((ERRORS + 1))
fi

if grep -q "formLoadTime" app/ui/components/Contact/index.tsx; then
    echo "  ✓ Timestamp field found in Contact form UI"
else
    echo "  ✗ ERROR: Timestamp field missing from Contact form UI"
    ERRORS=$((ERRORS + 1))
fi

# Check 2: Verify honeypot validation in contact-us.ts
echo ""
echo "✓ Checking Contact Us form backend validation..."
if grep -q "honeypot field filled" app/lib/data/contact-us.ts; then
    echo "  ✓ Honeypot validation found in contact-us.ts"
else
    echo "  ✗ ERROR: Honeypot validation missing from contact-us.ts"
    ERRORS=$((ERRORS + 1))
fi

if grep -q "form submitted too quickly" app/lib/data/contact-us.ts; then
    echo "  ✓ Time-based validation found in contact-us.ts"
else
    echo "  ✗ ERROR: Time-based validation missing from contact-us.ts"
    ERRORS=$((ERRORS + 1))
fi

# Check 3: Verify honeypot field in Registration form
echo ""
echo "✓ Checking Registration form honeypot implementation..."
if grep -q "name='website'" app/ui/components/Register/index.tsx; then
    echo "  ✓ Honeypot field found in Registration form UI"
else
    echo "  ✗ ERROR: Honeypot field missing from Registration form UI"
    ERRORS=$((ERRORS + 1))
fi

if grep -q "formLoadTime" app/ui/components/Register/index.tsx; then
    echo "  ✓ Timestamp field found in Registration form UI"
else
    echo "  ✗ ERROR: Timestamp field missing from Registration form UI"
    ERRORS=$((ERRORS + 1))
fi

# Check 4: Verify honeypot validation in platform-api.ts
echo ""
echo "✓ Checking Registration form backend validation..."
if grep -q "honeypot field filled" app/lib/data/platform-api.ts; then
    echo "  ✓ Honeypot validation found in platform-api.ts"
else
    echo "  ✗ ERROR: Honeypot validation missing from platform-api.ts"
    ERRORS=$((ERRORS + 1))
fi

if grep -q "form submitted too quickly" app/lib/data/platform-api.ts; then
    echo "  ✓ Time-based validation found in platform-api.ts"
else
    echo "  ✗ ERROR: Time-based validation missing from platform-api.ts"
    ERRORS=$((ERRORS + 1))
fi

# Check 5: Verify TypeScript compilation
echo ""
echo "✓ Checking TypeScript compilation..."
if npx tsc --noEmit --skipLibCheck 2>&1 | grep -q "error TS"; then
    echo "  ✗ ERROR: TypeScript compilation errors found"
    ERRORS=$((ERRORS + 1))
else
    echo "  ✓ No TypeScript errors"
fi

# Summary
echo ""
echo "==================================="
if [ $ERRORS -eq 0 ]; then
    echo "✓ All checks passed! Anti-bot protection is properly implemented."
    exit 0
else
    echo "✗ Found $ERRORS error(s). Please review the implementation."
    exit 1
fi
