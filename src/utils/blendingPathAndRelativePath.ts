const slash = '/';

/**
 * Blending path and relative path to end with selected folder.
 *
 * HTMLElement<Input type=file> webkitDirectory. After user select a folder, browser get all files instead
 * of folder stored in element.files.
 *
 * Examples:
 *     path: C:\Users\Settings\Documents\projects\copy\WU-005380910\UK\UK.json
 *     relativePath:  WU-005380910/UK/UK.json
 *
 *     result: C:\Users\Settings\Documents\projects\copy\WU-005380910
 *
 * @param path <string>;
 * @param relativePath <string> webkitRelativePath
 *
 * @return blended_path <string>
 */
export const BlendingPathAndRelativePath = (path: string, relativePath: string): string => {
    const folderName: string = relativePath.substring(0, relativePath.indexOf(slash));
    // REGEX: (?<=<target>)(\S*)$
    const reg = new RegExp(`(?<=${folderName})(\\S*)$`, 'g');
    return path.replace(reg, '');
};
