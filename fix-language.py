import re
import os
from pathlib import Path

# Path to frontend src
frontend_src = r"D:\Niraj\SAC\SAC Helpdesk\frontend\src"

def add_gettext_import(content, filepath):
    """Add getText import if not present"""
    if 'getText' in content or "import { getText }" in content:
        return content
    
    # Determine relative path to utils
    file_dir = os.path.dirname(filepath)
    src_dir = frontend_src
    rel_path = os.path.relpath(os.path.join(src_dir, 'utils'), file_dir).replace('\\', '/')
    
    import_statement = f"import {{ getText }} from '{rel_path}/language';\n"
    
    # Find the last import statement
    import_pattern = r"(import\s+.+\s+from\s+.+;)"
    imports = list(re.finditer(import_pattern, content))
    
    if imports:
        last_import = imports[-1]
        insert_pos = last_import.end()
        content = content[:insert_pos] + '\n' + import_statement + content[insert_pos:]
    
    return content

def replace_ternary_pattern(content):
    """Replace i18n.language === 'en' ? 'English' : 'मराठी' with getText('English', 'Hindi', 'मराठी')"""
    
    # Pattern to match: i18n.language === 'en' ? 'text1' : 'text2'
    pattern = r"i18n\.language\s*===\s*['\"]en['\"]\s*\?\s*(['\"])(.+?)\1\s*:\s*(['\"])(.+?)\3"
    
    def replacer(match):
        quote1 = match.group(1)
        english_text = match.group(2)
        quote2 = match.group(3)
        marathi_text = match.group(4)
        
        # For now, use same text for Hindi since we don't have Hindi translations
        # The existing Marathi text will be used for both Hindi and Marathi
        return f"getText('{english_text}', '{marathi_text}', '{marathi_text}')"
    
    return re.sub(pattern, replacer, content)

def process_file(filepath):
    """Process a single file"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        
        # Check if file uses the problematic pattern
        if "i18n.language === 'en'" in content:
            print(f"Processing: {os.path.basename(filepath)}")
            
            # Add import
            content = add_gettext_import(content, filepath)
            
            # Replace patterns
            content = replace_ternary_pattern(content)
            
            if content != original_content:
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(content)
                print(f"  ✓ Updated {os.path.basename(filepath)}")
                return True
    except Exception as e:
        print(f"  ✗ Error processing {filepath}: {e}")
    
    return False

def main():
    """Main function to process all files"""
    component_dirs = [
        os.path.join(frontend_src, 'components'),
        os.path.join(frontend_src, 'pages'),
    ]
    
    updated_count = 0
    
    for dir_path in component_dirs:
        if not os.path.exists(dir_path):
            continue
            
        for root, dirs, files in os.walk(dir_path):
            for file in files:
                if file.endswith('.tsx') or file.endswith('.ts'):
                    filepath = os.path.join(root, file)
                    if process_file(filepath):
                        updated_count += 1
    
    print(f"\n✓ Done! Updated {updated_count} files")

if __name__ == '__main__':
    main()
