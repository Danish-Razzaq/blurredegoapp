// RichTextRenderer.jsx
import React from 'react';

const RichTextRenderer = ({ content }) => {
    return content.map((node, index) => {
        // Handle paragraphs
        if (node.type === 'paragraph') {
            return (
                <p key={index}>
                    {node.children.map((child, childIndex) => {
                        // Handle link type
                        if (child.type === 'link') {
                            return (
                                <a key={childIndex} href={child.url} target="_blank" rel="noopener noreferrer">
                                    {child.children.map((linkChild) => linkChild.text).join('')}
                                </a>
                            );
                        }
                        // Handle bold text
                        if (child.bold) {
                            return <strong key={childIndex}>{child.text}</strong>;
                        }
                        // Handle italic text
                        if (child.italic) {
                            return <em key={childIndex}>{child.text}</em>;
                        }
                        // Handle underline text
                        if (child.underline) {
                            return <u key={childIndex}>{child.text}</u>;
                        }
                        // Handle strikethrough text
                        if (child.strikethrough) {
                            return <s key={childIndex}>{child.text}</s>; // <s> tag is commonly used for strikethrough
                        }
                        // Default text
                        return <span key={childIndex}>{child.text}</span>;
                    })}
                </p>
            );
        }

        // Handle headings (h1, h2, etc.)
        if (node.type === 'heading') {
            const level = node.level || 2; // Default to h2 if no level is provided
            const Tag = `h${level}`;
            return <Tag key={index}>{node.children.map((child) => child.text).join(' ')}</Tag>;
        }

        // Handle unordered lists
        if (node.type === 'list' && node.format === 'unordered') {
            return (
                <ul key={index}>
                    {node.children.map((listItem, listIndex) => (
                        <li key={listIndex}>
                            {listItem.children.map((child, childIndex) => {
                                // Handle different text types in list items
                                if (child.type === 'link') {
                                    return (
                                        <a key={childIndex} href={child.url} target="_blank" rel="noopener noreferrer">
                                            {child.children.map((linkChild) => linkChild.text).join('')}
                                        </a>
                                    );
                                }
                                // Handle bold text
                                if (child.bold) {
                                    return <strong key={childIndex}>{child.text}</strong>;
                                }
                                // Handle italic text
                                if (child.italic) {
                                    return <em key={childIndex}>{child.text}</em>;
                                }
                                // Handle underline text
                                if (child.underline) {
                                    return <u key={childIndex}>{child.text}</u>;
                                }
                                // Handle strikethrough text
                                if (child.strikethrough) {
                                    return <s key={childIndex}>{child.text}</s>;
                                }
                                // Default text
                                return <span key={childIndex}>{child.text}</span>;
                            })}
                        </li>
                    ))}
                </ul>
            );
        }

        // Handle ordered lists
        if (node.type === 'list' && node.format === 'ordered') {
            return (
                <ol key={index}>
                    {node.children.map((listItem, listIndex) => (
                        <li key={listIndex}>
                            {listItem.children.map((child) => {
                                // Handle different text types in list items
                                if (child.type === 'link') {
                                    return (
                                        <a key={childIndex} href={child.url} target="_blank" rel="noopener noreferrer">
                                            {child.children.map((linkChild) => linkChild.text).join('')}
                                        </a>
                                    );
                                }
                                // Handle bold text
                                if (child.bold) {
                                    return <strong key={childIndex}>{child.text}</strong>;
                                }
                                // Handle italic text
                                if (child.italic) {
                                    return <em key={childIndex}>{child.text}</em>;
                                }
                                // Handle underline text
                                if (child.underline) {
                                    return <u key={childIndex}>{child.text}</u>;
                                }
                                // Handle strikethrough text
                                if (child.strikethrough) {
                                    return <s key={childIndex}>{child.text}</s>;
                                }
                                // Default text
                                return <span key={childIndex}>{child.text}</span>;
                            })}
                        </li>
                    ))}
                </ol>
            );
        }

        // Handle blockquotes
        if (node.type === 'blockquote') {
            return (
                <blockquote key={index} className="border-l-4 border-gray-400 pl-4 italic text-gray-600">
                    {node.children.map((child, childIndex) => child.text)}
                </blockquote>
            );
        }

        // Return null for unsupported or unknown node types
        return null;
    });
};

export default RichTextRenderer;
