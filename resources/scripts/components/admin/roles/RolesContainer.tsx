import React, { useEffect, useState } from 'react';
import { useDeepMemoize } from '@/plugins/useDeepMemoize';
import { AdminContext } from '@/state/admin';
import { httpErrorToHuman } from '@/api/http';
import NewRoleButton from '@/components/admin/roles/NewRoleButton';
import FlashMessageRender from '@/components/FlashMessageRender';
import useFlash from '@/plugins/useFlash';
import tw from 'twin.macro';
import AdminContentBlock from '@/components/admin/AdminContentBlock';
import Spinner from '@/components/elements/Spinner';
import getRoles from '@/api/admin/roles/getRoles';

export default () => {
    const { addError, clearFlashes } = useFlash();
    const [ loading, setLoading ] = useState(true);

    const roles = useDeepMemoize(AdminContext.useStoreState(state => state.roles.data));
    const setRoles = AdminContext.useStoreActions(state => state.roles.setRoles);

    useEffect(() => {
        setLoading(!roles.length);
        clearFlashes('roles');

        getRoles()
            .then(roles => setRoles(roles))
            .catch(error => {
                console.error(error);
                addError({ message: httpErrorToHuman(error), key: 'roles' });
            })
            .then(() => setLoading(false));
    }, []);

    return (
        <AdminContentBlock>
            <div css={tw`w-full flex flex-row items-center mb-8`}>
                <div css={tw`flex flex-col`}>
                    <h2 css={tw`text-2xl text-neutral-50 font-header font-medium`}>Roles</h2>
                    <p css={tw`text-base text-neutral-400`}>Soon&trade;</p>
                </div>

                <NewRoleButton />
            </div>

            <FlashMessageRender byKey={'roles'} css={tw`mb-4`}/>

            <div css={tw`w-full flex flex-col`}>
                <div css={tw`w-full flex flex-col bg-neutral-700 rounded-lg shadow-md`}>
                    { loading ?
                        <div css={tw`w-full flex flex-col items-center justify-center`} style={{ height: '24rem' }}>
                            <Spinner size={'base'}/>
                        </div>
                        :
                        roles.length < 1 ?
                            <div css={tw`w-full flex flex-col items-center justify-center pb-6 py-2 sm:py-8 md:py-10 px-8`}>
                                <div css={tw`h-64 flex`}>
                                    <img src={'/assets/svgs/not_found.svg'} alt={'No Items'} css={tw`h-full select-none`}/>
                                </div>

                                <p css={tw`text-lg text-neutral-300 text-center font-normal sm:mt-8`}>No items could be found, it&apos;s almost like they are hiding.</p>
                            </div>
                            :
                            <div css={tw`overflow-x-auto`}>
                                <table css={tw`w-full table-auto`}>
                                    <thead>
                                        <tr>
                                            <th css={tw`py-4 px-4 text-left pl-8`}>
                                                <span css={tw`font-medium text-base text-neutral-300 text-left whitespace-nowrap mr-2`}>ID</span>
                                            </th>

                                            <th css={tw`py-4 px-4 text-left`}>
                                                <span css={tw`font-medium text-base text-neutral-300 text-left whitespace-nowrap mr-2`}>Name</span>
                                            </th>

                                            <th css={tw`py-4 px-4 text-left pr-8`}>
                                                <span css={tw`font-medium text-base text-neutral-300 text-left whitespace-nowrap mr-2`}>Description</span>
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody css={tw`bg-neutral-600`}>
                                        {
                                            roles.map(role => (
                                                <tr key={role.id} css={tw`h-12 cursor-pointer`}>
                                                    <td css={tw`py-3 px-4 text-neutral-200 text-left whitespace-nowrap pl-8`}>{role.id}</td>
                                                    <td css={tw`py-3 px-4 text-neutral-200 text-left whitespace-nowrap`}>{role.name}</td>
                                                    <td css={tw`py-3 px-4 text-neutral-200 text-left whitespace-nowrap pr-8`}>{role.description}</td>
                                                </tr>
                                            ))
                                        }
                                    </tbody>
                                </table>

                                <div css={tw`h-12 w-full flex flex-row items-center justify-between px-6`}>

                                </div>
                            </div>
                    }
                </div>
            </div>
        </AdminContentBlock>
    );
};
