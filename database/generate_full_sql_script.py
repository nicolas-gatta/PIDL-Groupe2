import os

def generate_full_script(file_list, output_file='full_script.sql'):
    """
    Generates a single SQL script from a list of SQL filenames.

    Args:
        file_list (list of str): List of filenames in the order to be merged.
        output_file (str): The name of the generated output SQL file.

    Returns:
        None
    """
    
    base_path = os.path.dirname(os.path.abspath(__file__))

    # SQL Header to prepend
    header = """
DROP DATABASE IF EXISTS `pidl`;
CREATE DATABASE `pidl`;
        """

    full_paths = [os.path.join(base_path, file) for file in file_list]
    
    missing_files = [file for file in full_paths if not os.path.exists(file)]
    
    if missing_files:
        print(f"The following files do not exist: {', '.join(missing_files)}")
        return
    
    # Write the header and all content to the output file
    with open(os.path.join(base_path,output_file), 'w') as outfile:
        outfile.write(header + "\n")
        for file in full_paths:
            with open(file, 'r') as infile:
                outfile.write(f"-- File: {file}\n")
                outfile.write(infile.read())
                outfile.write("\n\n")
                
    print(f"\n Successfully created '{output_file}' with the specified order.")
    
if __name__ == "__main__":
    generate_full_script(file_list=["schema.sql", "views.sql", "stored_procedures.sql", "seed.sql"])
