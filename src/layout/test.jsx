<Layout style={{minHeight: '100vh'}}>
    <Sider width='15%' collapsible={true} trigger={null} collapsed={isCollapsed} className={isCollapsed ? 'p-2.5 collapsed-menu-icons' : 'p-2.5'}>
        <Nav />
    </Sider>
    <Layout>
        <Header
            className="m-2.5 rounded-lg justify-between flex"
            style={{
                background: '#ffffff',
                height: 'fit-content',
                paddingTop: '10px',
                paddingBottom: '10px',
                paddingLeft: '10px',
            }}
        >
            <div className='flex items-center'>
                <button onClick={()=>setIsCollapsed(!isCollapsed)} className='collapse-button'>
                    {
                        isCollapsed ? <SquareChevronRight /> : <SquareChevronLeft />
                    }
                </button>
            </div>
            <div className='flex items-center'>
                <button className='p-1.5 bg-white focus:outline-none focus:border-transparent active:outline-none'>
                    <LogOut />
                </button>
            </div>
        </Header>
        <Layout>
            <Content style={{ margin: '10px 10px 10px 10px', borderRadius: '8px', background: '#ffffff' }}>
                <Outlet />
            </Content>
        </Layout>
        <Footer style={{background: '#ffffff', margin: '10px 10px 10px 10px', borderRadius: '8px', textAlign: 'center'}}>
            <h4> Copyright 2025 Liviu Ganea LTD</h4>
        </Footer>
    </Layout>
</Layout>