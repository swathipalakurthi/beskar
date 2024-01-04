import { EditorContent, BubbleMenu,  useEditor } from "@tiptap/react";
import styled from 'styled-components';
import Typography from '@tiptap/extension-typography'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'
import Document from '@tiptap/extension-document'
import Heading from '@tiptap/extension-heading'
import Placeholder from '@tiptap/extension-placeholder'
import StarterKit from '@tiptap/starter-kit'
import TextStyle from '@tiptap/extension-placeholder'
import Color from '@tiptap/extension-placeholder'
// import Collaboration from '@tiptap/extension-collaboration'
// import CollaborationCursor from '@tiptap/extension-collaboration-cursor'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
import CodeBlock from '@tiptap/extension-code-block'
// import { WebrtcProvider } from 'y-webrtc'
// import * as Y from 'yjs'
// import { EXAMPLE_JSON } from "@editor";
import { Button } from "@primer/react";
import { useDebounce } from "app/core/hooks/debounce";
import { useEffect, useState } from "react";
import { GRAPHQL_UPDATE_DOC_DATA } from "@queries/space";
import { client } from "@http";
import { useMutation } from "@apollo/client";
// import { useDidMountEffect } from "app/core/hooks/didMountEffect";


// const ydoc = new Y.Doc()
// const provider = new WebrtcProvider('tiptap-collaboration-cursor-extension', ydoc)




const extensions = [
    StarterKit.configure({
        history: false,
    }),
    Typography,
    Paragraph,
    Text,
    Document,
    Heading,
    Placeholder.configure({
        placeholder: 'Write somthing ....'
    }),
    TextStyle, 
    Color,
    // Collaboration.configure({
    //     document: ydoc,
    //   }),
    //   CollaborationCursor.configure({
    //     provider,
    //     user: {
    //       name: 'Cyndi Lauper',
    //       color: '#f783ac',
    //     },
    // }),
    TaskList,
    TaskItem.configure({
        nested: true,
    }),
    CodeBlock
];

// const content = EXAMPLE_JSON;
const StyledEditorContent = styled(EditorContent)`
    height: 100%;
    width: 100%;
    > .tiptap {
        height: 100%;
        margin-top: 0.75em;
        padding: 1rem;
        box-sizing: border-box;
    };
    ul[data-type="taskList"] {
        list-style: none;
        padding: 0;
      
        p {
          margin: 0;
        }
      
        li {
            display: flex;
        
            > label {
                flex: 0 0 auto;
                margin-right: 0.5rem;
                user-select: none;
            }
        
            > div {
                flex: 1 1 auto;
            }
            
            ul li,
            ol li {
                display: list-item;
            }
        
            ul[data-type="taskList"] > li {
                display: flex;
            }
        }
    };
    .spinner-animation {
        animation: spinner 1.6s linear infinite;
        animation-delay: -1.6s
    }
    
    .spinner-animation-secondary {
        animation-delay: -1s
    }
    
    @keyframes spinner {
        12.5 % {
            x: 13px;
            y: 1px
        }
    
        25% {
            x: 13px;
            y: 1px
        }
    
        37.5% {
            x: 13px;
            y: 13px
        }
    
        50% {
            x: 13px;
            y: 13px
        }
    
        62.5% {
            x: 1px;
            y: 13px
        }
    
        75% {
            x: 1px;
            y: 13px
        }
    
        87.5% {
            x: 1px;
            y: 1px
        }
    }
    
    .ProseMirror figure[data-type=imageBlock] {
        margin: 0
    }
    
    .ProseMirror figure[data-type=imageBlock] img {
        display: block;
        width: 100%;
        border-radius: .25rem
    }
    
    .ProseMirror figure[data-type=blockquoteFigure] {
        margin-top: 3.5rem;
        margin-bottom: 3.5rem;
        --tw-text-opacity: 1;
        color: rgb(0 0 0/var(--tw-text-opacity))
    }
    
    :is(.dark .ProseMirror figure[data-type=blockquoteFigure]) {
        --tw-text-opacity: 1;
        color: rgb(255 255 255/var(--tw-text-opacity))
    }
    
    .ProseMirror [data-type=blockquoteFigure] blockquote,.ProseMirror>blockquote blockquote {
        margin: 0
    }
    
    .ProseMirror [data-type=blockquoteFigure] blockquote>:first-child,.ProseMirror>blockquote blockquote>:first-child {
        margin-top: 0
    }
    
    .ProseMirror [data-type=blockquoteFigure] blockquote>:last-child,.ProseMirror>blockquote blockquote>:last-child {
        margin-bottom: 0
    }
    
    .ProseMirror [data-type=columns] {
        margin-top: 3.5rem;
        margin-bottom: 3rem;
        display: grid;
        gap: 1rem
    }
    
    .ProseMirror [data-type=columns].layout-sidebar-left {
        grid-template-columns: 40fr 60fr
    }
    
    .ProseMirror [data-type=columns].layout-sidebar-right {
        grid-template-columns: 60fr 40fr
    }
    
    .ProseMirror [data-type=columns].layout-two-column {
        grid-template-columns: 1fr 1fr
    }
    
    .ProseMirror [data-type=column] {
        overflow: auto
    }
    
    .ProseMirror code {
        border-radius: .125rem;
        --tw-bg-opacity: 1;
        background-color: rgb(23 23 23/var(--tw-bg-opacity));
        font-family: ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace;
        --tw-text-opacity: 1;
        color: rgb(255 255 255/var(--tw-text-opacity));
        caret-color: #fff;
        --tw-shadow: 0 10px 15px -3px rgba(0,0,0,.1),0 4px 6px -4px rgba(0,0,0,.1);
        --tw-shadow-colored: 0 10px 15px -3px var(--tw-shadow-color),0 4px 6px -4px var(--tw-shadow-color);
        box-shadow: var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)
    }
    
    .ProseMirror code::-moz-selection {
        background-color: hsla(0,0%,100%,.3)
    }
    
    .ProseMirror code::selection {
        background-color: hsla(0,0%,100%,.3)
    }
    
    .ProseMirror pre {
        margin-top: 3rem;
        margin-bottom: 3rem;
        border-radius: .25rem;
        border-width: 1px;
        --tw-border-opacity: 1;
        border-color: rgb(0 0 0/var(--tw-border-opacity));
        --tw-bg-opacity: 1;
        background-color: rgb(64 64 64/var(--tw-bg-opacity));
        padding: 1rem;
        --tw-text-opacity: 1;
        color: rgb(255 255 255/var(--tw-text-opacity));
        caret-color: #fff
    }
    
    :is(.dark .ProseMirror pre) {
        --tw-border-opacity: 1;
        border-color: rgb(38 38 38/var(--tw-border-opacity));
        --tw-bg-opacity: 1;
        background-color: rgb(23 23 23/var(--tw-bg-opacity))
    }
    
    .ProseMirror pre ::-moz-selection {
        background-color: hsla(0,0%,100%,.2)
    }
    
    .ProseMirror pre ::selection {
        background-color: hsla(0,0%,100%,.2)
    }
    
    .ProseMirror pre code {
        background-color: inherit;
        padding: 0;
        color: inherit;
        --tw-shadow: 0 0 #0000;
        --tw-shadow-colored: 0 0 #0000;
        box-shadow: var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)
    }
    
    .ProseMirror pre .hljs-comment,.ProseMirror pre .hljs-quote {
        --tw-text-opacity: 1;
        color: rgb(163 163 163/var(--tw-text-opacity))
    }
    
    .ProseMirror pre .hljs-attribute,.ProseMirror pre .hljs-link,.ProseMirror pre .hljs-name,.ProseMirror pre .hljs-regexp,.ProseMirror pre .hljs-selector-class,.ProseMirror pre .hljs-selector-id,.ProseMirror pre .hljs-tag,.ProseMirror pre .hljs-template-variable,.ProseMirror pre .hljs-variable {
        --tw-text-opacity: 1;
        color: rgb(252 165 165/var(--tw-text-opacity))
    }
    
    .ProseMirror pre .hljs-built_in,.ProseMirror pre .hljs-builtin-name,.ProseMirror pre .hljs-literal,.ProseMirror pre .hljs-meta,.ProseMirror pre .hljs-number,.ProseMirror pre .hljs-params,.ProseMirror pre .hljs-type {
        --tw-text-opacity: 1;
        color: rgb(253 186 116/var(--tw-text-opacity))
    }
    
    .ProseMirror pre .hljs-bullet,.ProseMirror pre .hljs-string,.ProseMirror pre .hljs-symbol {
        --tw-text-opacity: 1;
        color: rgb(190 242 100/var(--tw-text-opacity))
    }
    
    .ProseMirror pre .hljs-section,.ProseMirror pre .hljs-title {
        --tw-text-opacity: 1;
        color: rgb(253 224 71/var(--tw-text-opacity))
    }
    
    .ProseMirror pre .hljs-keyword,.ProseMirror pre .hljs-selector-tag {
        --tw-text-opacity: 1;
        color: rgb(94 234 212/var(--tw-text-opacity))
    }
    
    .ProseMirror pre .hljs-emphasis {
        font-style: italic
    }
    
    .ProseMirror pre .hljs-strong {
        font-weight: 700
    }
    
    .ProseMirror .collaboration-cursor__caret {
        pointer-events: none;
        position: relative;
        margin-left: -1px;
        margin-right: -1px;
        overflow-wrap: normal;
        word-break: normal;
        border-right-width: 1px;
        border-left-width: 1px;
        --tw-border-opacity: 1;
        border-color: rgb(0 0 0/var(--tw-border-opacity))
    }
    
    .ProseMirror .collaboration-cursor__label {
        position: absolute;
        left: -1px;
        top: -1.4em;
        -webkit-user-select: none;
        -moz-user-select: none;
        user-select: none;
        white-space: nowrap;
        border-radius: .25rem;
        border-top-left-radius: 0;
        padding: .125rem .375rem;
        font-size: .75rem;
        line-height: 1rem;
        font-weight: 600;
        line-height: 1;
        --tw-text-opacity: 1;
        color: rgb(0 0 0/var(--tw-text-opacity))
    }
    
    .ProseMirror ol {
        list-style-type: decimal
    }
    
    .ProseMirror ul {
        list-style-type: disc
    }
    
    .ProseMirror ol,.ProseMirror ul {
        margin-top: 1.5rem;
        margin-bottom: 1.5rem;
        padding: 0 2rem
    }
    
    .ProseMirror ol:first-child,.ProseMirror ul:first-child {
        margin-top: 0
    }
    
    .ProseMirror ol:last-child,.ProseMirror ul:last-child {
        margin-bottom: 0
    }
    
    .ProseMirror ol li,.ProseMirror ol ol,.ProseMirror ol ul,.ProseMirror ul li,.ProseMirror ul ol,.ProseMirror ul ul {
        margin-top: .25rem;
        margin-bottom: .25rem
    }
    
    .ProseMirror ol p,.ProseMirror ul p {
        margin-top: 0;
        margin-bottom: .25rem
    }
    
    .ProseMirror>ol,.ProseMirror>ul {
        margin-top: 2rem;
        margin-bottom: 2rem
    }
    
    .ProseMirror>ol:first-child,.ProseMirror>ul:first-child {
        margin-top: 0
    }
    
    .ProseMirror>ol:last-child,.ProseMirror>ul:last-child {
        margin-bottom: 0
    }
    
    .ProseMirror ul[data-type=taskList] {
        list-style-type: none;
        padding: 0
    }
    
    .ProseMirror ul[data-type=taskList] p {
        margin: 0
    }
    
    .ProseMirror ul[data-type=taskList] li {
        display: flex
    }
    
    .ProseMirror ul[data-type=taskList] li>label {
        margin-top: .25rem;
        margin-right: .5rem;
        flex: 1 1 auto;
        flex-shrink: 0;
        flex-grow: 0;
        -webkit-user-select: none;
        -moz-user-select: none;
        user-select: none
    }
    
    .ProseMirror ul[data-type=taskList] li>div {
        flex: 1 1 auto
    }
    
    .ProseMirror ul[data-type=taskList] li[data-checked=true] {
        text-decoration-line: line-through
    }
    
    .ProseMirror .is-empty:before {
        pointer-events: none;
        float: left;
        height: 0;
        width: 100%;
        color: rgba(0,0,0,.4)
    }
    
    :is(.dark .ProseMirror .is-empty):before {
        color: hsla(0,0%,100%,.4)
    }
    
    .ProseMirror.ProseMirror-focused>[data-type=columns]>[data-type=column]>p.is-empty.has-focus:before,.ProseMirror.ProseMirror-focused>p.has-focus.is-empty:before {
        content: "Type  /  to browse options"
    }
    
    .ProseMirror>.is-editor-empty:before {
        content: "Click here to start writing …"
    }
    
    .ProseMirror blockquote .is-empty:not(.is-editor-empty):first-child:last-child:before {
        content: "Enter a quote"
    }
    
    .ProseMirror blockquote+figcaption.is-empty:not(.is-editor-empty):before {
        content: "Author"
    }
    
    .ProseMirror [data-placeholder][data-suggestion] :before,.ProseMirror [data-placeholder][data-suggestion]:before {
        content: none!important
    }
    
    .ProseMirror .tableWrapper {
        margin-top: 3rem;
        margin-bottom: 3rem
    }
    
    .ProseMirror table {
        box-sizing: border-box;
        width: 100%;
        border-collapse: collapse;
        border-radius: .25rem;
        border-color: rgba(0,0,0,.1)
    }
    
    :is(.dark .ProseMirror table) {
        border-color: hsla(0,0%,100%,.2)
    }
    
    .ProseMirror table td,.ProseMirror table th {
        position: relative;
        min-width: 100px;
        border-width: 1px;
        border-color: rgba(0,0,0,.1);
        padding: .5rem;
        text-align: left;
        vertical-align: top
    }
    
    :is(.dark .ProseMirror table td),:is(.dark .ProseMirror table th) {
        border-color: hsla(0,0%,100%,.2)
    }
    
    .ProseMirror table td:first-of-type:not(a),.ProseMirror table th:first-of-type:not(a) {
        margin-top: 0
    }
    
    .ProseMirror table td p,.ProseMirror table th p {
        margin: 0
    }
    
    .ProseMirror table td p+p,.ProseMirror table th p+p {
        margin-top: .75rem
    }
    
    .ProseMirror table th {
        font-weight: 700
    }
    
    .ProseMirror table .column-resize-handle {
        pointer-events: none;
        position: absolute;
        bottom: -2px;
        right: -.25rem;
        top: 0;
        display: flex;
        width: .5rem
    }
    
    .ProseMirror table .column-resize-handle:before {
        margin-left: .5rem;
        height: 100%;
        width: 1px;
        background-color: rgba(0,0,0,.2)
    }
    
    :is(.dark .ProseMirror table .column-resize-handle):before {
        background-color: hsla(0,0%,100%,.2)
    }
    
    .ProseMirror table .column-resize-handle:before {
        content: ""
    }
    
    .ProseMirror table .selectedCell {
        border-style: double;
        border-color: rgba(0,0,0,.2);
        background-color: rgba(0,0,0,.05)
    }
    
    :is(.dark .ProseMirror table .selectedCell) {
        border-color: hsla(0,0%,100%,.2);
        background-color: hsla(0,0%,100%,.1)
    }
    
    .ProseMirror table .grip-column,.ProseMirror table .grip-row {
        position: absolute;
        z-index: 10;
        display: flex;
        cursor: pointer;
        align-items: center;
        justify-content: center;
        background-color: rgba(0,0,0,.05)
    }
    
    :is(.dark .ProseMirror table .grip-column),:is(.dark .ProseMirror table .grip-row) {
        background-color: hsla(0,0%,100%,.1)
    }
    
    .ProseMirror table .grip-column {
        left: 0;
        top: -.75rem;
        margin-left: -1px;
        height: .75rem;
        width: calc(100% + 1px);
        border-left-width: 1px;
        border-color: rgba(0,0,0,.2)
    }
    
    :is(.dark .ProseMirror table .grip-column) {
        border-color: hsla(0,0%,100%,.2)
    }
    
    .ProseMirror table .grip-column.selected:before,.ProseMirror table .grip-column:hover:before {
        content: "";
        width: .625rem
    }
    
    .ProseMirror table .grip-column:hover {
        background-color: rgba(0,0,0,.1)
    }
    
    :is(.dark .ProseMirror table .grip-column:hover) {
        background-color: hsla(0,0%,100%,.2)
    }
    
    .ProseMirror table .grip-column:hover:before {
        border-bottom: 2px;
        border-color: rgba(0,0,0,.6);
        border-style: dotted
    }
    
    :is(.dark .ProseMirror table .grip-column:hover):before {
        border-color: hsla(0,0%,100%,.6)
    }
    
    .ProseMirror table .grip-column.first {
        border-top-left-radius: .125rem;
        border-color: transparent
    }
    
    .ProseMirror table .grip-column.last {
        border-top-right-radius: .125rem
    }
    
    .ProseMirror table .grip-column.selected {
        border-color: rgba(0,0,0,.3);
        background-color: rgba(0,0,0,.3);
        --tw-shadow: 0 1px 2px 0 rgba(0,0,0,.05);
        --tw-shadow-colored: 0 1px 2px 0 var(--tw-shadow-color);
        box-shadow: var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)
    }
    
    :is(.dark .ProseMirror table .grip-column.selected) {
        border-color: hsla(0,0%,100%,.3);
        background-color: hsla(0,0%,100%,.3)
    }
    
    .ProseMirror table .grip-column.selected:before {
        border-bottom-width: 2px;
        border-style: dotted
    }
    
    .ProseMirror table .grip-row {
        left: -.75rem;
        top: 0;
        margin-top: -1px;
        height: calc(100% + 1px);
        width: .75rem;
        border-top-width: 1px;
        border-color: rgba(0,0,0,.2)
    }
    
    :is(.dark .ProseMirror table .grip-row) {
        border-color: hsla(0,0%,100%,.2)
    }
    
    .ProseMirror table .grip-row.selected:before,.ProseMirror table .grip-row:hover:before {
        height: .625rem;
        content: ""
    }
    
    .ProseMirror table .grip-row:hover {
        background-color: rgba(0,0,0,.1)
    }
    
    :is(.dark .ProseMirror table .grip-row:hover) {
        background-color: hsla(0,0%,100%,.2)
    }
    
    .ProseMirror table .grip-row:hover:before {
        border-left: 2px;
        border-color: rgba(0,0,0,.6);
        border-style: dotted
    }
    
    :is(.dark .ProseMirror table .grip-row:hover):before {
        border-color: hsla(0,0%,100%,.6)
    }
    
    .ProseMirror table .grip-row.first {
        border-top-left-radius: .125rem;
        border-color: transparent
    }
    
    .ProseMirror table .grip-row.last {
        border-bottom-left-radius: .125rem
    }
    
    .ProseMirror table .grip-row.selected {
        border-color: rgba(0,0,0,.3);
        background-color: rgba(0,0,0,.3);
        --tw-shadow: 0 1px 2px 0 rgba(0,0,0,.05);
        --tw-shadow-colored: 0 1px 2px 0 var(--tw-shadow-color);
        box-shadow: var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)
    }
    
    :is(.dark .ProseMirror table .grip-row.selected) {
        border-color: hsla(0,0%,100%,.3);
        background-color: hsla(0,0%,100%,.3)
    }
    
    .ProseMirror table .grip-row.selected:before {
        border-left-width: 2px;
        border-style: dotted
    }
    
    .ProseMirror p {
        margin-top: .75rem;
        margin-bottom: .75rem;
        line-height: 1.625
    }
    
    .ProseMirror p:first-child {
        margin-top: 0
    }
    
    .ProseMirror p:last-child {
        margin-bottom: 0
    }
    
    .ProseMirror>p {
        margin-top: 1.5rem;
        margin-bottom: 1.5rem
    }
    
    .ProseMirror>p:first-child {
        margin-top: 0
    }
    
    .ProseMirror>p:last-child {
        margin-bottom: 0
    }
    
    .ProseMirror h1 {
        font-size: 1.875rem;
        line-height: 2.25rem
    }
    
    .ProseMirror h2 {
        font-size: 1.5rem;
        line-height: 2rem
    }
    
    .ProseMirror h3 {
        font-size: 1.25rem;
        line-height: 1.75rem
    }
    
    .ProseMirror h4 {
        font-size: 1.125rem;
        line-height: 1.75rem
    }
    
    .ProseMirror h5 {
        font-size: 1rem;
        line-height: 1.5rem
    }
    
    .ProseMirror h6 {
        font-size: .875rem;
        line-height: 1.25rem
    }
    
    .ProseMirror h1,.ProseMirror h2,.ProseMirror h3,.ProseMirror h4,.ProseMirror h5,.ProseMirror h6 {
        font-weight: 700
    }
    
    .ProseMirror h1:first-child,.ProseMirror h2:first-child,.ProseMirror h3:first-child,.ProseMirror h4:first-child,.ProseMirror h5:first-child,.ProseMirror h6:first-child {
        margin-top: 0
    }
    
    .ProseMirror h1:last-child,.ProseMirror h2:last-child,.ProseMirror h3:last-child,.ProseMirror h4:last-child,.ProseMirror h5:last-child,.ProseMirror h6:last-child {
        margin-bottom: 0
    }
    
    .ProseMirror h1,.ProseMirror h2,.ProseMirror h3 {
        margin-top: 3rem
    }
    
    .ProseMirror h4,.ProseMirror h5,.ProseMirror h6 {
        margin-top: 2rem
    }
    
    .ProseMirror a.link {
        font-weight: 800;
        --tw-text-opacity: 1;
        color: rgb(59 130 246/var(--tw-text-opacity))
    }
    
    :is(.dark .ProseMirror a.link) {
        --tw-text-opacity: 1;
        color: rgb(96 165 250/var(--tw-text-opacity))
    }
    
    .ProseMirror mark {
        border-radius: .125rem;
        --tw-bg-opacity: 1;
        background-color: rgb(239 68 68/var(--tw-bg-opacity));
        -webkit-box-decoration-break: clone;
        box-decoration-break: clone;
        padding: .25rem 0;
        color: inherit
    }
    
    :is(.dark .ProseMirror mark) {
        --tw-bg-opacity: 1;
        background-color: rgb(248 113 113/var(--tw-bg-opacity))
    }
    
    .ProseMirror img {
        height: auto;
        width: 100%;
        max-width: 100%
    }
    
    .ProseMirror [data-type=horizontalRule] {
        margin-top: 2rem;
        margin-bottom: 2rem;
        cursor: pointer;
        padding-top: 1rem;
        padding-bottom: 1rem;
        transition-property: all;
        transition-duration: .1s;
        transition-timing-function: cubic-bezier(.4,0,.2,1);
        animation-duration: .1s;
        animation-timing-function: cubic-bezier(.4,0,.2,1)
    }
    
    .ProseMirror [data-type=horizontalRule].ProseMirror-selectednode {
        background-color: rgba(0,0,0,.05)
    }
    
    :is(.dark .ProseMirror [data-type=horizontalRule].ProseMirror-selectednode) {
        background-color: hsla(0,0%,100%,.1)
    }
    
    .ProseMirror [data-type=horizontalRule].ProseMirror-selectednode hr {
        border-top-color: rgba(0,0,0,.3)
    }
    
    :is(.dark .ProseMirror [data-type=horizontalRule].ProseMirror-selectednode hr) {
        border-top-color: hsla(0,0%,100%,.3)
    }
    
    .ProseMirror [data-type=horizontalRule]:hover:not(.ProseMirror [data-type=horizontalRule].ProseMirror-selectednode) {
        background-color: rgba(0,0,0,.05)
    }
    
    :is(.dark .ProseMirror [data-type=horizontalRule]:hover:not(.ProseMirror [data-type=horizontalRule].ProseMirror-selectednode)) {
        background-color: hsla(0,0%,100%,.1)
    }
    
    .ProseMirror [data-type=horizontalRule] hr {
        border-width: 1px 0 0;
        border-color: rgba(0,0,0,.2);
        background-color: rgba(0,0,0,.8)
    }
    
    :is(.dark .ProseMirror [data-type=horizontalRule] hr) {
        border-color: hsla(0,0%,100%,.2);
        background-color: hsla(0,0%,100%,.8)
    }
    
    .ProseMirror {
        z-index: 0;
        padding: 1rem 2rem 4rem 5rem;
        caret-color: #000;
        outline-width: 0
    }
    
    :is(.dark .ProseMirror) {
        caret-color: #fff
    }
    
    @media (min-width: 1024px) {
        .ProseMirror {
            padding-left:2rem;
            padding-right: 2rem
        }
    }
    
    .ProseMirror>* {
        margin-left: auto;
        margin-right: auto;
    }
    
    .ProseMirror .selection {
        display: inline
    }
    
    .ProseMirror ::-moz-selection {
        background-color: rgba(0,0,0,.1)
    }
    
    .ProseMirror .selection,.ProseMirror ::selection {
        background-color: rgba(0,0,0,.1)
    }
    
    :is(.dark .ProseMirror *)::-moz-selection {
        background-color: hsla(0,0%,100%,.2)
    }
    
    :is(.dark .ProseMirror *)::selection,:is(.dark .ProseMirror .selection) {
        background-color: hsla(0,0%,100%,.2)
    }
    
    .ProseMirror>.react-renderer {
        margin-top: 3rem;
        margin-bottom: 3rem
    }
    
    .ProseMirror>.react-renderer:first-child {
        margin-top: 0
    }
    
    .ProseMirror>.react-renderer:last-child {
        margin-bottom: 0
    }
    
    .ProseMirror.resize-cursor {
        cursor: col-resize
    }
    
    .ProseMirror .ProseMirror-gapcursor {
        position: relative;
        margin-left: auto;
        margin-right: auto;
        width: 100%;
        max-width: 42rem
    }
    
    .ProseMirror .ProseMirror-gapcursor:after {
        top: -1.5em;
        left: 0;
        right: 0;
        margin-left: auto;
        margin-right: auto;
        width: 100%;
        max-width: 42rem;
        border-top-color: rgba(0,0,0,.4)
    }
    
    :is(.dark .ProseMirror .ProseMirror-gapcursor):after {
        border-top-color: hsla(0,0%,100%,.4)
    }
    
    [data-theme=slash-command] {
        width: 1000vw
    }
    
`;

export default function TipTap({ content, pageId, id, editable = true }: { content: Object; pageId: string; id: number, editable?: boolean }) {
    const [editedData, setEditedData] = useState(null);
    const debouncedValue = useDebounce(editedData, 10000);
    const [updated, setUpdated] = useState(false)
    const [mutateFunction, { data, loading, error }] = useMutation(GRAPHQL_UPDATE_DOC_DATA, { client: client });



    const editor = useEditor({
        extensions: extensions,
        content: content,
        editable: editable,
        onUpdate: ({ editor }) => {
            setUpdated(true);
            setEditedData(editor.getJSON());
        }
    });

    useEffect(() => {
        if (content && editor) {
            editor.commands.setContent(content);
        }
    }, [content, editor]);

    useEffect(() => {
        if (updated) {
            mutateFunction({ variables: { id: id, pageId: pageId, data: debouncedValue, title: 'Fifth Page' } })
                .then((data) => console.log(data))
                .catch((error) => console.log(error));
        }
    }, [debouncedValue]);



    return (
        <>
        {
            editor &&
            <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }}>
                <Button onClick={() => editor.chain().focus().toggleBold().run()} className={editor.isActive('bold') ? 'is-active' : ''}>
                    bold
                </Button>
                <Button onClick={() => editor.chain().focus().toggleItalic().run()} className={editor.isActive('italic') ? 'is-active' : ''}>
                    italic
                </Button>
                <Button onClick={() => editor.chain().focus().toggleStrike().run()} className={editor.isActive('strike') ? 'is-active' : ''}>
                    strike
                </Button>
            </BubbleMenu>
        }
        <StyledEditorContent className="editor" editor={editor} />
        </>
    )
}
