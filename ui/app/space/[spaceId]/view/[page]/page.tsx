'use client'
import { useQuery } from "@apollo/client";
import TipTap from "@components/tiptap";
import { client } from "@http";
import { Box, Heading, Spinner } from "@primer/react";
import { GRAPHQL_GET_PAGE } from "@queries/space";
import { useEffect, useState } from "react";

interface IDoc {
    data: any;
    id: number;
    title: string;
    version: Date
}

interface IPage {
    date_created: Date;
    draft: number;
    id: number;
    owner_id: string;
    parent_id: string | null;
    space_id: string;
    status: string | null;
    docs: Array<IDoc>
}

interface IData {
    core_page: Array<IPage>
}

export default function Page({ params }: { params: { page: string } }) {
    const  [editorData, setEditorData] = useState({});
    const { data, loading, error, refetch } = useQuery<IData>(GRAPHQL_GET_PAGE, { client, variables: { pageId: params.page } });

    useEffect(() => {
        try {
            if (data) {
                const eData = typeof data.core_page[0].docs[0].data === 'string' ? JSON.parse(data.core_page[0].docs[0].data) : data.core_page[0].docs[0].data;
                setEditorData(eData);
            }
        } catch (e){
            // console.log(e);
        }
    }, [data, error]);

    if (loading) {
        <Box sx={{textAlign: "center"}}>
            <Spinner size="medium" />
        </Box>
    }

    return (
        <div style={{height: 300 }}>
            {
                data && (
                    <Box>
                        <Box sx={{paddingLeft: '2rem'}}>
                            <Heading as="h1">{data.core_page[0].docs[0].title}</Heading>
                        </Box>
                        <TipTap editable={false} content={editorData} pageId={params.page} id={data.core_page[0].docs[0].id} />
                    </Box>
                )
            }
            
        </div>
    )
}