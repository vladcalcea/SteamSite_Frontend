import React, { useEffect, useState, useRef } from "react";
import {
    Table,
    Button,
    Modal,
    Form,
    Input,
    InputNumber,
    DatePicker,
    Switch,
    Upload,
    message,
    Popconfirm,
} from "antd";
import { UploadOutlined, PlusOutlined } from "@ant-design/icons";
import API from "../../api/axios.js";
import dayjs from "dayjs";

const Dashboard = () => {
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingGameId, setEditingGameId] = useState(null);
    const [form] = Form.useForm();
    const [file, setFile] = useState(null); // header image
    const [backgroundFile, setBackgroundFile] = useState(null); // background image
    const [gameImages, setGameImages] = useState([]); // multiple game images for carousel
    const [imageUrls, setImageUrls] = useState({});
    const objectUrlsRef = useRef({});

    // Helper to fetch image as blob and create object URL
    const fetchImageBlobUrl = async (url, gameId) => {
        if (!url) return null;
        try {
            const response = await fetch(`http://localhost:5012${url}`);
            if (!response.ok) return null;
            const blob = await response.blob();
            const objectUrl = URL.createObjectURL(blob);
            objectUrlsRef.current[gameId] = objectUrl;
            return objectUrl;
        } catch {
            return null;
        }
    };

    // Fetch games and their images as blobs
    const fetchGames = async () => {
        try {
            const res = await API.get("/api/games");
            setGames(res.data);
            // Fetch images as blobs
            const urls = {};
            await Promise.all(
                res.data.map(async (game) => {
                    if (game.headerImageUrl) {
                        urls[game.gameId] = await fetchImageBlobUrl(
                            game.headerImageUrl,
                            game.gameId
                        );
                    }
                })
            );
            setImageUrls(urls);
        } catch (err) {
            console.error("fetchGames error:", err);
            message.error("Failed to load games");
        }
    };

    useEffect(() => {
        fetchGames();
    }, []);

    // Clean up object URLs on unmount or games change
    useEffect(() => {
        return () => {
            Object.values(objectUrlsRef.current).forEach((url) =>
                URL.revokeObjectURL(url)
            );
        };
    }, [games]);

    // Open modal for new game
    const openAddModal = () => {
        setIsEditing(false);
        setEditingGameId(null);
        setFile(null);
        setBackgroundFile(null);
        setGameImages([]);
        form.resetFields();
        setIsModalVisible(true);
    };

    // Open modal for editing
    const openEditModal = (game) => {
        setIsEditing(true);
        setEditingGameId(game.gameId);
        setFile(null);
        setBackgroundFile(null);
        setGameImages([]);

        form.setFieldsValue({
            name: game.name,
            shortDescription: game.shortDescription,
            detailedDescription: game.detailedDescription,
            price: game.price,
            developer: game.developer,
            publisher: game.publisher,
            categories: game.categories,
            tags: game.tags,
            trailerUrl: game.trailerUrl,
            releaseDate: game.releaseDate ? dayjs(game.releaseDate) : null,
            isFeatured: game.isFeatured,
            isPublished: game.isPublished,
        });

        setIsModalVisible(true);
    };

    // Submit add/edit
    const handleSubmit = async (values) => {
        setLoading(true);
        try {
            let response;
            if (file || backgroundFile) {
                // Use FormData for file upload, all fields as strings
                const formData = new FormData();
                Object.entries(values).forEach(([key, value]) => {
                    if (key === "releaseDate" && value) {
                        formData.append(key, value.format("YYYY-MM-DD"));
                    } else if (typeof value === "boolean") {
                        formData.append(key, value ? "true" : "false");
                    } else if (typeof value === "number") {
                        formData.append(key, value.toString());
                    } else if (value !== undefined && value !== null) {
                        formData.append(key, value);
                    }
                });
                if (file) formData.append("headerImage", file);
                if (backgroundFile) formData.append("backgroundImage", backgroundFile);

                // Add multiple game images for carousel
                gameImages.forEach((image, index) => {
                    formData.append("gameImages", image);
                });
                if (isEditing && editingGameId) {
                    response = await API.put(
                        `/api/games/${editingGameId}`,
                        formData
                    );
                    message.success("Game updated successfully!");
                } else {
                    response = await API.post("/api/games", formData);
                    message.success("Game added successfully!");
                }
            } else {
                // No file, send JSON
                const data = { ...values };
                if (data.releaseDate && data.releaseDate.format) {
                    data.releaseDate = data.releaseDate.format("YYYY-MM-DD");
                }
                if (isEditing && editingGameId) {
                    response = await API.put(
                        `/api/games/${editingGameId}`,
                        data,
                        { headers: { "Content-Type": "application/json" } }
                    );
                    message.success("Game updated successfully!");
                } else {
                    response = await API.post(
                        "/api/games",
                        data,
                        { headers: { "Content-Type": "application/json" } }
                    );
                    message.success("Game added successfully!");
                }
            }
            setIsModalVisible(false);
            form.resetFields();
            setFile(null);
            setBackgroundFile(null);
            setGameImages([]);
            fetchGames();
        } catch (err) {
            console.error("handleSubmit error:", err);
            message.error("Failed to save game");
        } finally {
            setLoading(false);
        }
    };

    // Delete game (with confirmation and JWT from cookies)
    const handleDelete = async (id) => {
        try {
            // Get JWT from cookies
            const jwt = document.cookie.split('; ').find(row => row.startsWith('jwt='))?.split('=')[1];
            await API.delete(`/api/games/${id}`, {
                headers: {
                    "Authorization": jwt ? `Bearer ${jwt}` : undefined,
                    "Content-Type": "application/json"
                }
            });
            message.success("Game deleted successfully!");
            fetchGames();
        } catch (err) {
            console.error("handleDelete error:", err);
            message.error("Failed to delete game");
        }
    };

    const columns = [
        {
            title: "Image",
            dataIndex: "headerImageUrl",
            render: (url, record) =>
                imageUrls[record.gameId] ? (
                    <img
                        src={imageUrls[record.gameId]}
                        alt="game"
                        style={{ width: 80 }}
                    />
                ) : (
                    "No image"
                ),
        },
        { title: "Name", dataIndex: "name" },
        { title: "Developer", dataIndex: "developer" },
        { title: "Publisher", dataIndex: "publisher" },
        { title: "Price", dataIndex: "price" },
        {
            title: "Actions",
            render: (text, record) => (
                <>
                    <Button
                        onClick={() => openEditModal(record)}
                        style={{ marginRight: 8 }}
                    >
                        Edit
                    </Button>
                    <Popconfirm
                        title="Are you sure you want to delete this game?"
                        onConfirm={() => handleDelete(record.gameId)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button danger>Delete</Button>
                    </Popconfirm>
                </>
            ),
        },
    ];

    return (
        <div style={{ padding: 20 }}>
            <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={openAddModal}
                style={{ marginBottom: 16 }}
            >
                Add Game
            </Button>

            <Table
                rowKey="gameId"
                dataSource={games}
                columns={columns}
                loading={loading}
            />

            <Modal
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
            >
                <Form layout="vertical" form={form} onFinish={handleSubmit}>
                    <Form.Item
                        name="name"
                        label="Name"
                        rules={[{ required: true }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="shortDescription"
                        label="Short Description"
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="detailedDescription"
                        label="Detailed Description"
                    >
                        <Input.TextArea rows={4} />
                    </Form.Item>
                    <Form.Item name="price" label="Price">
                        <InputNumber
                            min={0}
                            step={0.01}
                            style={{ width: "100%" }}
                        />
                    </Form.Item>
                    <Form.Item name="developer" label="Developer">
                        <Input />
                    </Form.Item>
                    <Form.Item name="publisher" label="Publisher">
                        <Input />
                    </Form.Item>
                    <Form.Item name="categories" label="Categories">
                        <Input />
                    </Form.Item>
                    <Form.Item name="tags" label="Tags">
                        <Input />
                    </Form.Item>
                    <Form.Item name="trailerUrl" label="Trailer URL">
                        <Input placeholder="Enter YouTube or video URL" />
                    </Form.Item>
                    <Form.Item name="releaseDate" label="Release Date">
                        <DatePicker style={{ width: "100%" }} />
                    </Form.Item>
                    <Form.Item
                        name="isFeatured"
                        label="Featured"
                        valuePropName="checked"
                    >
                        <Switch />
                    </Form.Item>
                    <Form.Item
                        name="isPublished"
                        label="Published"
                        valuePropName="checked"
                    >
                        <Switch defaultChecked />
                    </Form.Item>

                    <Form.Item label="Header Image">
                        <Upload
                            beforeUpload={(file) => {
                                setFile(file);
                                return false;
                            }}
                            fileList={file ? [file] : []}
                            onRemove={() => setFile(null)}
                            maxCount={1}
                        >
                            <Button icon={<UploadOutlined />}>Select Header Image</Button>
                        </Upload>
                    </Form.Item>
                    <Form.Item label="Background Image">
                        <Upload
                            beforeUpload={(file) => {
                                setBackgroundFile(file);
                                return false;
                            }}
                            fileList={backgroundFile ? [backgroundFile] : []}
                            onRemove={() => setBackgroundFile(null)}
                            maxCount={1}
                        >
                            <Button icon={<UploadOutlined />}>Select Background Image</Button>
                        </Upload>
                    </Form.Item>

                    <Form.Item label="Game Images (Carousel)">
                        <Upload
                            beforeUpload={(file) => {
                                setGameImages(prev => [...prev, file]);
                                return false;
                            }}
                            fileList={gameImages}
                            onRemove={(file) => {
                                setGameImages(prev => prev.filter(img => img.uid !== file.uid));
                            }}
                            multiple
                            maxCount={10}
                        >
                            <Button icon={<UploadOutlined />}>Select Game Images</Button>
                        </Upload>
                    </Form.Item>

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={loading}
                            block
                        >
                            {isEditing ? "Update Game" : "Add Game"}
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default Dashboard;